const lighthouse = require("lighthouse");
const { URL } = require("url");

async function lighthouseAudit(url, browser) {
  const { lhr } = await lighthouse(`http://${url}`, {
    port: new URL(browser.wsEndpoint()).port,
    output: "json",
    onlyCategories: ['performance']
  });

  const lighthouse_scores = lhr.categories.performance.score * 100
  console.log('Performance score was', lighthouse_scores);

  return lighthouse_scores;
}

module.exports = {
  lighthouseAudit,
};
