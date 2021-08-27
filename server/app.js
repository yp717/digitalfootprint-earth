const dns = require("dns");
const express = require("express");
const fetch = require("node-fetch");
const { handle } = require("./cdnHandeler");
const app = express();
const port = 3000;
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

  dns.lookup(URL, async function (err, addresses, family) {
    const request = await fetch(`http://ip-api.com/json/${URL}`);
    const data = await request.json();
    handle(
      {
        ...data,
        originalIP: addresses,
      },
      res
    );
  });
});

app.listen(port, () => {
  console.log(`CDN FINDER listening at http://localhost:${port}`);
});
