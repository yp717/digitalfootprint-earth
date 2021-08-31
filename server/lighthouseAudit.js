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
  });

  const lighthouse_scores = Object.values(lhr.categories);
  console.log(
    `Lighthouse scores: ${lighthouse_scores.map((c) => c.score).join(", ")}`
  );

  return lighthouse_scores;
}

module.exports = {
  lighthouseAudit,
};
