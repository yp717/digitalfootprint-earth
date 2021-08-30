const dns = require("dns");
const express = require("express");
const fetch = require("node-fetch");
const { handle } = require("./cdnHandeler");
const puppeteer = require("puppeteer");

const { computePageWeight } = require("./computePageWeight");
const { lighthouseAudit } = require("./lighthouseAudit");

const app = express();
var get_ip = require("ipware")().get_ip;
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
  console.log(req.clientIp, req.clientIpRoutable);

  const userData = await fetch(`http://ip-api.com/json/${IP}`).then((res) =>
    res.json()
  );
  const data = await fetch(`http://ip-api.com/json/${URL}`).then((res) =>
    res.json()
  );
  const greenWebFoundation = await fetch(
    `https://admin.thegreenwebfoundation.org/api/v3/greencheck/${URL}`
  ).then((res) => res.json());

  // you have to ensure that the stripped url is passed into this function
  const browser = await puppeteer.launch();
  const lighthouseScores = await lighthouseAudit(URL, browser);
  const performanceData = await computePageWeight(URL, browser);

  console.log(performanceData);
  console.log(lighthouseScores);
  // Calculate the C02 on the server -> using per megabyte value for CO2
  // 2020 web almanac: 1.82 MB = 1.2 g C0

  handle(
    {
      requestData: { ...data, url: URL, lighthouseScores, performanceData },
      userInfo: userData,
      environmentalData: {
        greenWebFoundation,
      },
    },
    res
  );
});

app.listen(port, () => {
  console.log(`CDN FINDER listening at http://localhost:${port}`);
});
