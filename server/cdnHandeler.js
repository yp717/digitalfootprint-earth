const AmazonCDNS = require("./cdn-locations/amazon.json");
const FastlyCDNS = require("./cdn-locations/fastly.json");
const CloudflareCDNS = require("./cdn-locations/cloud-flare.json");
const AzureCDNS = require("./cdn-locations/azure.json");
const GoogleCDNS = require("./cdn-locations/google.json");
const AMAZON = /Amazon/;
const FASTLY = /Fastly/;
const CLOUDFLARE = /Cloudflare/;
const AKAMI = /Akamai/;
const MICROSOFT = /Microsoft/;
const GOOGLE = /Google/;

function handle(data, res) {
  const { isp } = data;

  switch (true) {
    case AMAZON.test(isp):
      res.end(
        JSON.stringify({
          ...data,
          CDN_LOCATIONS: AmazonCDNS,
          CDN_PROVIDER: "Amazon",
        })
      );
      break;

    case FASTLY.test(isp):
      res.end(
        JSON.stringify({
          ...data,
          CDN_LOCATIONS: FastlyCDNS,
          CDN_PROVIDER: "Fastly",
        })
      );
      break;
    case CLOUDFLARE.test(isp):
      res.end(
        JSON.stringify({
          ...data,
          CDN_LOCATIONS: CloudflareCDNS,
          CDN_PROVIDER: "CloudFlare",
        })
      );
      break;
    case MICROSOFT.test(isp):
      res.end(
        JSON.stringify({
          ...data,
          CDN_LOCATIONS: AzureCDNS,
          CDN_PROVIDER: "Microsoft Azure",
        })
      );
      break;
    case GOOGLE.test(isp):
      res.end(
        JSON.stringify({
          ...data,
          CDN_LOCATIONS: GoogleCDNS,
          CDN_PROVIDER: "Google",
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
