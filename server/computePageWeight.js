/**
 * Compute the total weight of a website based on the performance metrics
 * @param {} performanceMetrics
 * @returns totalWeight in bytes of the website
 */
function computeTotalWeight(performanceMetrics) {
  return performanceMetrics.reduce((acc, curr) => {
    if (curr.transferSize > 0 && typeof curr.transferSize !== "undefined") {
      acc += curr.transferSize;
    }
    return acc;
  }, 0);
}

// Run lighthouse for performance only because we don't care about the rest
async function computePageWeight(url, browser) {
  // Puppeteer set up
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  // Probably easier to make a consistent estimate with the cache disabled
  await page.setCacheEnabled(false);
  await page.setViewport({
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
  });

  // Go to URL and let it try things until the network tab is idle
  // This should eventually be the URL of the web page that the user enters
  await page.goto(`http://${url}`, {
    waitUntil: "networkidle2",
  });

  // Store the available performance metrics
  const performanceMetrics = JSON.parse(
    await page.evaluate(() => JSON.stringify(performance.getEntries()))
  );

  const totalSize = computeTotalWeight(performanceMetrics);

  console.log(`TOTAL SIZE: ${totalSize}`);

  // Pull out the other metrics from the results
  console.log("Devtools: Performance.getMetrics");
  let result = await page._client.send("Performance.getMetrics");
  console.log(result.metrics);

  browser.close();

  return result.metrics;
}

module.exports = {
  computePageWeight,
};
