require("dotenv").config();
const crypto = require("crypto");
const path = require("path");
const express = require("express");
var firebase = require("firebase-admin");
const differenceInHours = require("date-fns/differenceInHours");
var cors = require("cors");
const { generateAudit } = require("./generateAudit");
const { generateBadge } = require("./generateBadge");
const { gatherUserData } = require("./gatherUserData");
const { handle } = require("./cdnHandeler");
const { validateURL } = require("./urlValidator");
const app = express();
var get_ip = require("ipware")().get_ip;

const INDEX = "/index.html";

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
  return differenceInHours(currentTime, auditTime) <= 23;
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

app.get("/audit/:url", cors(), async (req, res) => {
  var URL = req.params.url;
  const validURL = await validateURL(URL);
  if (!validURL) {
    res.sendStatus(400);
    return;
  }
  let IP = !req.clientIpRoutable ? "51.9.166.141" : req.clientIp;
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
            const userInfo = await gatherUserData(IP);
            const { isp } = data.requestData;
            const cdnInfo = handle(isp);
            res.send({ ...data, userInfo, cdnInfo });
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
    const auditData = await generateAudit(URL, db, id);
    const { isp } = auditData.requestData;
    const cdnInfo = handle(isp);
    res.send({ ...auditData, cdnInfo });
  }
});

app.get("/story/:url", cors(), async (req, res) => {
  var URL = req.params.url;
  const validURL = await validateURL(URL);
  if (!validURL) {
    res.sendStatus(400);
    return;
  }
  let IP = !req.clientIpRoutable ? "51.9.166.141" : req.clientIp;
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
            const userInfo = await gatherUserData(IP);
            const { isp } = data.requestData;
            const cdnInfo = handle(isp);
            res.send({ ...data, userInfo, cdnInfo });
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
      // Story is already ready -> Send it!
      const userInfo = await gatherUserData(IP);
      const { isp } = data.requestData;
      const cdnInfo = handle(isp);
      res.send({ ...data, userInfo, cdnInfo });
      return;
    }
  } else {
    console.log("Creating Story");
    const auditData = await generateAudit(URL, db, id);
    const userInfo = await gatherUserData(IP);
    const { isp } = auditData.requestData;
    const cdnInfo = handle(isp);
    res.send({ ...auditData, userInfo, cdnInfo });
  }
});

app.get("/badge", (req, res) => {
  // res.sendFile("/server/generateBadge.js", (err) => console.log(err));
  res.sendFile(path.join(__dirname, "generateBadge.js"));
});

app.listen(port, () => {
  console.log(`CDN FINDER listening at http://localhost:${port}`);
});
