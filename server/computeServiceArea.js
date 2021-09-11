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

  // to get km radius -> this assumes the c02 is given in grams
  const radius = c02_used / avg_C02_car_per_km;
  const distanceCutoff = [radius];
  return serviceArea({
    facilities: [origin],
    // defaultBreaks: [distanceCutoff],
    impedanceAttributeName: "Kilometers",
    kilometers: distanceCutoff,
    trimOuterPolygon: true,
    authentication,
  });
}

module.exports = {
  computeServiceArea,
};
