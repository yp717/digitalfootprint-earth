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

function handle(isp) {
  switch (true) {
    case AMAZON.test(isp):
      return {
        cdnLocations: AmazonCDNS,
        cdnProvider: "Amazon",
      };

    case FASTLY.test(isp):
      return {
        cdnLocations: FastlyCDNS,
        cdnProvider: "Fastly",
      };
    case CLOUDFLARE.test(isp):
      return {
        cdnLocations: CloudflareCDNS,
        cdnProvider: "CloudFlare",
      };
    case MICROSOFT.test(isp):
      return {
        cdnLocations: AzureCDNS,
        cdnProvider: "Microsoft Azure",
      };
    case GOOGLE.test(isp):
      return {
        cdnLocations: GoogleCDNS,
        cdnProvider: "Google",
      };
    case AKAMAI.test(isp):
      // console.log(Object.keys(AkamaiCDNS).map(key => AkamaiCDNS[key]))
      return {
        cdnLocations: Object.keys(AkamaiCDNS).map((key) => AkamaiCDNS[key]),
        cdnProvider: "Akamai",
      };
    default:
      return {
        cdnLocations: [],
        cdnProvider: "UNKNOWN",
      };
  }
}

module.exports = {
  handle,
};
