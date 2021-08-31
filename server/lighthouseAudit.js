const lighthouse = require("lighthouse");
const { URL } = require("url");

async function lighthouseAudit(url, browser) {
  // Wait for Lighthouse to open url, then inject our stylesheet.
  browser.on("targetchanged", async (target) => {
    const page = await target.page();

    if (page && page.url() === url) {
      await page.addStyleTag({ content: "p {color: red}" });
    }
  });

  // Lighthouse will open the URL.
  // Puppeteer will observe `targetchanged` and inject our stylesheet.
  const { lhr } = await lighthouse(`http://${url}`, {
    port: new URL(browser.wsEndpoint()).port,
    output: "json",
    logLevel: "info",
    onlyCategories: ['performance']
  });

  const lighthouse_scores = lhr.categories.performance.score * 100
  console.log('Performance score was', lighthouse_scores);

  return lighthouse_scores;
}

module.exports = {
  lighthouseAudit,
};
