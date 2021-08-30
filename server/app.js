const dns = require("dns");
const express = require("express");
const fetch = require("node-fetch");
const { handle } = require("./cdnHandeler");
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

  // const performanceData = await computePageWeight()

  // Calculate the C02 on the server -> using per megabyte value for CO2

  handle(
    {
      requestData: { ...data, url: URL, ...performanceData },
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
