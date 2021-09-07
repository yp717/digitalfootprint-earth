require("dotenv").config();
require("cross-fetch/polyfill");
require("isomorphic-form-data");

const { ApiKey } = require("@esri/arcgis-rest-auth");
// const { solveRoute } = require("@esri/arcgis-rest-routing");
const { serviceArea } = require("@esri/arcgis-rest-routing");

const apiKey = process.env.ARCGIS_API_KEY;

const avg_C02_car_per_km = 120.1; // g/km

async function computeServiceArea(origin, c02_used) {
  const authentication = new ApiKey({
    key: apiKey,
  });

  // console.log(origin); // should have coordinates given as lat and long
  // console.log(c02_used); // should be a number that says how much c02 was used

  // console.log(serviceArea);
  // to get km radius -> this assumes the c02 is given in grams
  const radius = c02_used / avg_C02_car_per_km;
  const distanceCutoff = [radius];

  return serviceArea({
    facilities: [origin],
    defaultBreaks: [distanceCutoff],
    impedanceAttributeName: "Kilometers",
    // kilometers: distanceCutoff,
    trimOuterPolygon: true,
    authentication,
  });

  // url not accessible to anonymous users
  // const url = `https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World`;

  // // request("https://www.arcgis.com/sharing/rest/info").then((response) =>
  // //   console.log(response)
  // // );

  // solveRoute({
  //   stops: [
  //     // [-117.195677, 34.056383],
  //     // [-117.918976, 33.812092],
  //     start,
  //     destination,
  //   ],
  //   authentication,
  // }).then((response) => {
  //   console.log(response.directions[0].summary.totalDriveTime);
  // });
}

module.exports = {
  computeServiceArea,
};
