require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const express = require("express");
var firebase = require("firebase-admin");
const differenceInHours = require("date-fns/differenceInHours");
const format = require("date-fns/format");
var cors = require("cors");
const { generateAudit } = require("./generateAudit");
const { computeServiceArea } = require("./computeServiceArea");
const { gatherUserData } = require("./gatherUserData");
const { handle } = require("./cdnHandeler");
const { validateURL } = require("./urlValidator");
const app = express();
var get_ip = require("ipware")().get_ip;

const { constructStoryResponse } = require("./utils/constructStoryResponse");

const port = process.env.PORT || 3000;

var serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const db = firebase.firestore();

var whitelist = [
  "http://localhost:8000",
  "http://localhost:9000",
  "http://cdnhatch-client.onrender.com",
  "https://cdnhatch-client.onrender.com",
  "http://digitalfootprint.earth",
  "https://digitalfootprint.earth",
];
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
};

function notStale(doc) {
  const { time } = doc.data();
  if (!time) {
    return false;
  }
  const currentTime = new Date();
  const auditTime = time.toDate();
  return differenceInHours(currentTime, auditTime) < 12;
}

app.use(function (req, res, next) {
  get_ip(req);
  next();
});

app.get("/stats", cors(corsOptions), async (req, res) => {
  const statsDocRef = await db.collection("stats").doc("global");
  const doc = await statsDocRef.get();
  if (doc.exists) {
    res.send(doc.data());
  } else {
    res.sendStatus(404);
  }
});

app.get("/timeline/:url", cors(corsOptions), async (req, res) => {
  var URL = req.params.url.toLowerCase();
  const validURL = await validateURL(URL);
  if (!validURL) {
    res.sendStatus(400);
    return;
  }
  let IP = !req.clientIpRoutable ? "51.9.166.141" : req.clientIp;
  const id = crypto.createHash(`md5`).update(`${URL}`).digest(`hex`);
  const timelineDocRef = await db.collection("timelines").doc(id);
  const doc = await timelineDocRef.get();
  if (doc.exists) {
    let response = doc.data().timeline;
    response = response.map((item) => ({ ...item, date: item.date.toDate() }));

    res.send({ timeline: response });
  } else {
    res.sendStatus(404);
    res.end();
  }
});

app.get("/audit/:url", cors(), async (req, res) => {
  var URL = req.params.url.toLowerCase();
  const validURL = await validateURL(URL);

  if (!validURL) {
    res.sendStatus(400);
    return;
  }

  const id = crypto.createHash(`md5`).update(`${URL}`).digest(`hex`);
  const userDocRef = await db.collection("stories").doc(id);
  const doc = await userDocRef.get();

  if (doc.exists && notStale(doc)) {
    const { locked, time, ...data } = doc.data();
    if (locked) {
      console.log("Story being processed");
      const observer = userDocRef.onSnapshot(
        async (doc) => {
          const { locked, time, ...data } = doc.data();
          if (!locked) {
            const { isp } = data.requestData;
            const cdnInfo = handle(isp);
            res.send({ ...data, cdnInfo });
            observer();
          }
        },
        (err) => {
          observer();
          res.sendStatus(500);
          res.end();
          return;
        }
      );
    } else {
      const { isp } = data.requestData;
      const cdnInfo = handle(isp);
      res.send({ ...data, cdnInfo });
      return;
    }
  } else {
    try {
      const auditData = await generateAudit(URL, db, id);
      const { isp } = auditData.requestData;
      const cdnInfo = handle(isp);
      res.send({ ...auditData, cdnInfo });
    } catch (e) {
      res.send(500);
    }
  }
});

app.get("/story/:url", cors(), async (req, res) => {
  var URL = req.params.url.toLowerCase();
  const validURL = await validateURL(URL);
  if (!validURL) {
    res.sendStatus(400);
    return;
  }

  const id = crypto.createHash(`md5`).update(`${URL}`).digest(`hex`);
  const userDocRef = await db.collection("stories").doc(id);
  const doc = await userDocRef.get();

  if (doc.exists && notStale(doc)) {
    console.log("Story active");
    const { locked, time, ...data } = doc.data();
    if (locked) {
      console.log("Story being processed");
      const observer = userDocRef.onSnapshot(
        async (doc) => {
          const { locked, time, ...data } = doc.data();
          if (!locked) {
            await constructStoryResponse(data, req, res);
            observer();
          }
        },
        (err) => {
          observer();
          console.error(err);
          res.sendStatus(500);
          res.end();
          return;
        }
      );
    } else {
      // Story is already ready -> Send it!
      try {
        await constructStoryResponse(data, req, res);
      } catch (e) {
        console.error(e);
      }
      return;
    }
  } else {
    console.log("Creating Story");
    try {
      const auditData = await generateAudit(URL, db, id);
      await constructStoryResponse(auditData, req, res);
      return;
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
      res.end();
      return;
    }
  }
});

app.get("/badge", async (req, res) => {
  let URL = req.query.url || req.get("host");
  URL = URL.toLowerCase()
  const id = crypto.createHash(`md5`).update(`${URL}`).digest(`hex`);
  const userDocRef = await db.collection("stories").doc(id);
  const doc = await userDocRef.get();
  if (doc.exists && notStale(doc)) {
    console.log("Story active");
    const { locked, time, ...data } = doc.data();
    const {
      auditScores: { total },
    } = data;
    console.log({ time });
    const auditTime = time.toDate();
    console.log({ auditTime });
    fs.readFile(path.join(__dirname, "generateBadge.js"), (error, data) => {
      if (error) {
        throw error;
      }
      // console.log(data.toString().replace("[URL]", req.headers.origin));
      res.send(
        data
          .toString()
          .replace("[URL]", URL)
          .replace("[SCORE]", total)
          .replace("[DATE]", "Audited " + format(auditTime, "MM/dd/yyyy"))
      );
    });
  } else {
    fs.readFile(path.join(__dirname, "generateBadge.js"), (error, data) => {
      if (error) {
        throw error;
      }
      // console.log(data.toString().replace("[URL]", req.headers.origin));
      res.send(
        data
          .toString()
          .replace("[URL]", URL)
          .replace("[SCORE]", "-")
          .replace("[DATE]", "Auditing right now.")
      );
    });
    try {
      generateAudit(URL, db, id);
    } catch (e) {
      console.log(e);
    }
  }
});

app.listen(port, () => {
  console.log(`CDN FINDER listening at http://localhost:${port}`);
});
