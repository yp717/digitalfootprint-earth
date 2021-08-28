const dns = require("dns");
const express = require("express");
const fetch = require("node-fetch");
const { handle } = require("./cdnHandeler");
const app = express();
const port = process.env.PORT || 3000;
var cors = require("cors");
var whitelist = ["http://localhost:8000", "http://localhost:9000"];
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
};

app.use(cors(corsOptions));

app.get("/:url", async (req, res) => {
  var URL = req.params.url;
  let IP = req.ip === "::1" ? "51.9.166.141" : req.ip;
  console.log(req.url);
  dns.lookup(URL, async function (err, addresses, family) {
    const userData = await fetch(`http://ip-api.com/json/${IP}`).then((res) =>
      res.json()
    );
    const data = await fetch(`http://ip-api.com/json/${URL}`).then((res) =>
      res.json()
    );
    handle(
      {
        requestData: { ...data, url: URL },
        userInfo: userData,
      },
      res
    );
  });
});

app.listen(port, () => {
  console.log(`CDN FINDER listening at http://localhost:${port}`);
});
