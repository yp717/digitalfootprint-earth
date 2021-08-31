require("dotenv").config();
const crypto = require("crypto");
const express = require("express");
const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
var firebase = require("firebase-admin");
const { handle } = require("./cdnHandeler");
const { computePageWeight } = require("./computePageWeight");
const { lighthouseAudit } = require("./lighthouseAudit");

const app = express();
var get_ip = require("ipware")().get_ip;

var serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const db = firebase.firestore();

const port = process.env.PORT || 3000;
var cors = require("cors");
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

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  var ip_info = get_ip(req);
  console.log(ip_info);
  next();
});

app.get("/:url", async (req, res) => {
  var URL = req.params.url;
  let IP = !req.clientIpRoutable ? "51.9.166.141" : req.clientIp;
  const id = crypto.createHash(`md5`).update(`${URL}_${IP}`).digest(`hex`);

  const userDocRef = await db.collection("stories").doc(id);
  const doc = await userDocRef.get();
  if (doc.exists) {
    console.log("Story Requested Already!");
    // if cache - > redirect to URL
    const { locked, data } = doc.data();
    // if in progress -> wait -> redirect to URL
    if (locked) {
      console.log("Waiting for story");
      userDocRef.onSnapshot(
        (doc) => {
          const { locked, data } = doc.data();
          if (!locked) {
            res.send(data);
          }
        },
        (err) => {
          res.sendStatus(500);
          res.end();
          return;
        }
      );
    } else {
      // Story is already ready -> Send it!
      res.send(data);
      return;
    }
  } else {
    db.collection("stories").doc(id).set(
      {
        locked: true,
      },
      { merge: true }
    );
    // Create the Story
    const userData = await fetch(`http://ip-api.com/json/${IP}`).then((res) =>
      res.json()
    );
    const data = await fetch(`http://ip-api.com/json/${URL}`).then((res) =>
      res.json()
    );
    const greenWebFoundation = await fetch(
      `https://admin.thegreenwebfoundation.org/api/v3/greencheck/${URL}`
    ).then((res) => res.json());
    const browser = await puppeteer.launch();
    const performanceScore = await lighthouseAudit(URL, browser);
    const totalSize = await computePageWeight(URL, browser);
    browser.close();
    const DataWithCDN = handle({
      requestData: { ...data, url: URL, performanceScore, totalSize },
      userInfo: userData,
      environmentalData: {
        greenWebFoundation,
      },
    });
    res.send(DataWithCDN);
    db.collection("stories").doc(id).set(
      {
        locked: false,
        data: DataWithCDN,
      },
      { merge: true }
    );
  }
});

app.listen(port, () => {
  console.log(`CDN FINDER listening at http://localhost:${port}`);
});
