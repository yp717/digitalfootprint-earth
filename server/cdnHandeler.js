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

function handle(data) {
  const { isp } = data.requestData;

  switch (true) {
    case AMAZON.test(isp):
      return JSON.stringify({
        ...data,
        cdnInfo: {
          cdnLocations: AmazonCDNS,
          cdnProvider: "Amazon",
        },
      });

    case FASTLY.test(isp):
      return JSON.stringify({
        ...data,
        cdnInfo: {
          cdnLocations: FastlyCDNS,
          cdnProvider: "Fastly",
        },
      });
    case CLOUDFLARE.test(isp):
      return JSON.stringify({
        ...data,
        cdnInfo: {
          cdnLocations: CloudflareCDNS,
          cdnProvider: "CloudFlare",
        },
      });
    case MICROSOFT.test(isp):
      return JSON.stringify({
        ...data,
        cdnInfo: {
          cdnLocations: AzureCDNS,
          cdnProvider: "Microsoft Azure",
        },
      });
    case GOOGLE.test(isp):
      return JSON.stringify({
        ...data,
        cdnInfo: {
          cdnLocations: GoogleCDNS,
          cdnProvider: "Google",
        },
      });
    case AKAMAI.test(isp):
      // console.log(Object.keys(AkamaiCDNS).map(key => AkamaiCDNS[key]))
      return JSON.stringify({
        ...data,
        cdnInfo: {
          cdnLocations: Object.keys(AkamaiCDNS).map((key) => AkamaiCDNS[key]),
          cdnProvider: "Akamai",
        },
      });
    default:
      console.log(data);
      return JSON.stringify(data);
  }
}

module.exports = {
  handle,
};
