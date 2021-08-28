const AmazonCDNS = require("./cdn-locations/amazon.json");
const FastlyCDNS = require("./cdn-locations/fastly.json");
const CloudflareCDNS = require("./cdn-locations/cloud-flare.json");
const AzureCDNS = require("./cdn-locations/azure.json");
const GoogleCDNS = require("./cdn-locations/google.json");
const AkamaiCDNS = require("./cdn-locations/akamai.json");
const AMAZON = /Amazon/;
const FASTLY = /Fastly/;
const CLOUDFLARE = /Cloudflare/;
const AKAMAI = /Akamai/;
const MICROSOFT = /Microsoft/;
const GOOGLE = /Google/;

function handle(data, res) {
  const { isp } = data.requestData;

  switch (true) {
    case AMAZON.test(isp):
      res.end(
        JSON.stringify({
          ...data,
          cdnInfo: {
            cdnLocations: AmazonCDNS,
            cdnProvider: "Amazon",
          },
        })
      );
      break;

    case FASTLY.test(isp):
      res.end(
        JSON.stringify({
          ...data,
          cdnInfo: {
            cdnLocations: FastlyCDNS,
            cdnProvider: "Fastly",
          },
        })
      );
      break;
    case CLOUDFLARE.test(isp):
      res.end(
        JSON.stringify({
          ...data,
          cdnInfo: {
            cdnLocations: CloudflareCDNS,
            cdnProvider: "CloudFlare",
          },
        })
      );
      break;
    case MICROSOFT.test(isp):
      res.end(
        JSON.stringify({
          ...data,
          cdnInfo: {
            cdnLocations: AzureCDNS,
            cdnProvider: "Microsoft Azure",
          },
        })
      );
      break;
    case GOOGLE.test(isp):
      res.end(
        JSON.stringify({
          ...data,
          cdnInfo: {
            cdnLocations: GoogleCDNS,
            cdnProvider: "Google",
          },
        })
      );
      break;
    case AKAMAI.test(isp):
      // console.log(Object.keys(AkamaiCDNS).map(key => AkamaiCDNS[key]))
      res.end(
        JSON.stringify({
          ...data,
          cdnInfo: {
            cdnLocations: Object.keys(AkamaiCDNS).map(key => AkamaiCDNS[key]),
            cdnProvider: "Akamai",
          },
        })
      );
      break;
    default:
      console.log(data);
      res.end(JSON.stringify(data));
      break;
  }
}

module.exports = {
  handle,
};
