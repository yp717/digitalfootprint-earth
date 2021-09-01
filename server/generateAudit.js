const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const { computePageWeight } = require("./computePageWeight");
const { lighthouseAudit } = require("./lighthouseAudit");
const puppeteerArgs = require("./puppeteerArgs.json");

async function generateAudit(URL) {
  const browser = await puppeteer.launch({
    headless: true,
    args: puppeteerArgs,
  });
  const [data, greenWebFoundation, performanceScore, totalSize] =
    await Promise.all([
      fetch(`http://ip-api.com/json/${URL}`).then((res) => res.json()),
      fetch(
        `https://admin.thegreenwebfoundation.org/api/v3/greencheck/${URL}`
      ).then((res) => res.json()),
      lighthouseAudit(URL, browser),
      computePageWeight(URL, browser),
    ]);
  browser.close();
  const fullDataSet = {
    requestData: data,
    performance: {
      performanceScore,
      totalSize,
    },
    environmentalData: { greenWebFoundation },
  };
  return fullDataSet;
}

module.exports = {
  generateAudit,
};
