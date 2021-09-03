const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const { computePageWeight } = require("./computePageWeight");
const { lighthouseAudit } = require("./lighthouseAudit");
const puppeteerArgs = require("./puppeteerArgs.json");

async function generateAudit(URL, db, id) {
  db.collection("stories").doc(id).set(
    {
      locked: true,
      time: new Date(),
    },
    { merge: true }
  );

  const browser = await puppeteer.launch({
    headless: true,
    args: puppeteerArgs,
  });
  const [data, greenWebFoundation, performanceScore] =
    await Promise.all([
      fetch(`http://ip-api.com/json/${URL}`).then((res) => res.json()),
      fetch(
        `https://admin.thegreenwebfoundation.org/api/v3/greencheck/${URL}`
      ).then((res) => res.json()),
      lighthouseAudit(URL, browser),
    ]);
    const totalSize = await computePageWeight(URL, browser)
  browser.close();
  const totalSizeMB = totalSize / 1024 / 1024;
  const auditScores = {
    pageWeight:
      totalSizeMB <= 2.17
        ? 3
        : totalSizeMB < 2.17 * 1.5
        ? 2
        : totalSizeMB < 2.17 * 2
        ? 1
        : 0,
    performance:
      performanceScore > 0.85
        ? 3
        : performanceScore > 0.7
        ? 2
        : performanceScore > 0.55
        ? 1
        : 0,
    hosting: greenWebFoundation.green ? 3 : 0,
  };
  const score = Object.entries(auditScores).reduce((acc, [key, score]) => {
    acc += score;
    return acc;
  }, 0);
  auditScores.total = score;
  const fullDataSet = {
    requestData: data,
    performance: {
      performanceScore,
      totalSize,
    },
    environmentalData: { greenWebFoundation },
    auditScores,
  };
  let { environmentalData, requestData, performance } = fullDataSet;

  db.collection("stories").doc(id).set(
    {
      locked: false,
      environmentalData,
      requestData,
      performance,
      auditScores,
      score,
    },
    { merge: true }
  );
  return fullDataSet;
}

module.exports = {
  generateAudit,
};
