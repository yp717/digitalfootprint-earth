require("dotenv").config();
require("cross-fetch/polyfill");
require("isomorphic-form-data");

const { ApiKey } = require("@esri/arcgis-rest-auth");
const { solveRoute } = require("@esri/arcgis-rest-routing");

const apiKey = process.env.ARCGIS_API_KEY;

async function computeRoute(start, destination) {
  console.log(start);
  console.log(destination);

  // url not accessible to anonymous users
  const url = `https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World`;

  // request("https://www.arcgis.com/sharing/rest/info").then((response) =>
  //   console.log(response)
  // );

  const authentication = new ApiKey({
    key: apiKey,
  });

  solveRoute({
    stops: [
      // [-117.195677, 34.056383],
      // [-117.918976, 33.812092],
      start,
      destination,
    ],
    authentication,
  }).then((response) => {
    console.log(response.directions[0].summary.totalDriveTime);
  });
}

module.exports = {
  computeRoute,
};
