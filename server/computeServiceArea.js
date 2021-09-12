require("dotenv").config();
const fetch = require("node-fetch");

const apiKey = process.env.ARCGIS_API_KEY;

async function computeServiceArea(origin, c02_used) {
  // how many minutes it takes to generate the same amount of carbon as the website?
  // By visiting the website 100 times, compute the radius that you could drive to from your location
  // assumes average car speed of 50 km/h and avg c02 output from cars of 0.099 kg/km (= 99 g/km)
  // approximation based on:https://www.carbonindependent.org/17.html#:~:text=A%20second%20estimate%20(not%20used,i.e.%20a%20considerably%20higher%20estimate
  const timeRadius = (c02_used * 100 * 60 )/ (99 * 50)//(50 * 0.099 * 1000) / (60 * c02_used);

  let response = await fetch(
    `https://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea?token=${apiKey}&defaultBreaks=${[timeRadius]}&facilities=${[origin]}&f=json`
  ).then(res => res.json());
  response.approxDistance = (c02_used * 100) / 99
  return response
}

module.exports = {
  computeServiceArea,
};
