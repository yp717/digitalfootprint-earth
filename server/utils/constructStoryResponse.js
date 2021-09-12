const fetch = require("node-fetch");
const { gatherUserData } = require("../gatherUserData");
const { computeServiceArea } = require("../computeServiceArea");
const { handle } = require("../cdnHandeler");
const exampleCdnLoc = require("../cdn-locations/akamai.json");

async function constructStoryResponse(data, req, res) {
  const IP = !req.clientIpRoutable ? "51.9.166.141" : req.clientIp;
  let userInfo = await gatherUserData(IP);
  const { isp } = data.requestData;
  const cdnInfo = handle(isp);
  const totalSizeMB = data.performance.totalSize / 1024 / 1024;
  const c02_produced = totalSizeMB * 10;
  const lat = req.query.lat || userInfo.lat;
  const lon = req.query.lon || userInfo.lon;
  const serviceArea = await computeServiceArea([lon, lat], c02_produced);

  let geoLocation = undefined;

  if (req.query.lat && req.query.lon) {
    geoLocation = { lat, lon };
    const { city } = await fetch(
      `https://geocode.xyz/${lat},${lon}?geoit=json`
    ).then((res) => res.json());
    userInfo = { ...userInfo, city };
  }

  res.send({ ...data, userInfo, cdnInfo, serviceArea, geoLocation, exampleCdnLoc: Object.keys(exampleCdnLoc).map((key) => exampleCdnLoc[key]), });
}

module.exports = {
  constructStoryResponse,
};
