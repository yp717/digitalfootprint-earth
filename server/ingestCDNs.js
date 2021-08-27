const fetch = require("node-fetch");
const fs = require("fs");

async function getCloudFlare() {
  const request = await fetch(`https://www.cloudflare.com/ips-v4`);
  const data = await request.text();
  const ipRanges = data.split(/\n/);
  const ips = ipRanges.map((ipRange) => ipRange.split("/")[0]);
  const response = await fetch(`http://ip-api.com/batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ips),
  });
  const reponseData = await response.json();
  let finalMap = reponseData.map((item, i) => ({
    ...item,
    range: ipRanges[i].split("/")[1],
  }));
  fs.writeFile(
    "./cdn-locations/cloud-flare.json",
    JSON.stringify(finalMap, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
}

async function getFastly() {
  const request = await fetch(`https://api.fastly.com/public-ip-list`);
  const data = await request.json();
  const ipRanges = data.addresses;
  const ips = ipRanges.map((ipRange) => ipRange.split("/")[0]);
  const response = await fetch(`http://ip-api.com/batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ips),
  });
  const reponseData = await response.json();
  let finalMap = reponseData.map((item, i) => ({
    ...item,
    range: ipRanges[i].split("/")[1],
  }));
  fs.writeFile(
    "./cdn-locations/fastly.json",
    JSON.stringify(finalMap, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
}

async function getAmazon() {
  const request = await fetch(`https://ip-ranges.amazonaws.com/ip-ranges.json`);
  const data = await request.json();
  const ipRanges = data.prefixes
    .filter((item) => item.service === "CLOUDFRONT")
    .map((item) => item.ip_prefix);
  const ips = ipRanges.map((ipRange) => ipRange.split("/")[0]);

  const firstHalf = [...ips];
  const secondHalf = firstHalf.splice(0, Math.ceil(firstHalf.length / 2));

  const split = [firstHalf, secondHalf];
  let combined = [];
  for (const half of split) {
    const response = await fetch(`http://ip-api.com/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(half),
    });
    const reponseData = await response.json();
    combined = [...combined, ...reponseData];
  }

  let finalMap = combined.map((item, i) => ({
    ...item,
    range: ipRanges[i].split("/")[1],
  }));
  fs.writeFile(
    "./cdn-locations/amazon.json",
    JSON.stringify(finalMap, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
}

async function getAzure() {
  const request = await fetch(
    `https://raw.githubusercontent.com/Gelob/azure-cdn-ips/master/edgenodes.json`
  );
  const data = await request.json();
  const ipRanges = data.value.reduce((acc, cur) => {
    cur.properties.ipAddressGroups[0].ipv4Addresses.forEach(
      ({ baseIpAddress }) => acc.push(baseIpAddress)
    );
    return acc;
  }, []);

  const firstHalf = [...ipRanges];
  const secondHalf = firstHalf.splice(0, Math.ceil(firstHalf.length / 2));

  const split = [firstHalf, secondHalf];
  let combined = [];
  for (const half of split) {
    const response = await fetch(`http://ip-api.com/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(half),
    });
    const reponseData = await response.json();
    combined = [...combined, ...reponseData];
  }

  let finalMap = combined.map((item, i) => ({
    ...item,
  }));
  fs.writeFile(
    "./cdn-locations/azure.json",
    JSON.stringify(finalMap, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
}

async function getGoogle() {
    const request = await fetch(
      `https://www.gstatic.com/ipranges/goog.json`
    );
    const data = await request.json();
    const ipRanges = data.prefixes.filter((data) => data.ipv4Prefix).map(data => data.ipv4Prefix)
    const ips = ipRanges.map((ipRange) => ipRange.split("/")[0]);
    const firstHalf = [...ips];
    const secondHalf = firstHalf.splice(0, Math.ceil(firstHalf.length / 2));
  
    const split = [firstHalf, secondHalf];
    let combined = [];
    for (const half of split) {
      const response = await fetch(`http://ip-api.com/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(half),
      });
      const reponseData = await response.json();
      combined = [...combined, ...reponseData];
    }
  
    let finalMap = combined.map((item, i) => ({
      ...item,
    }));
    fs.writeFile(
      "./cdn-locations/google.json",
      JSON.stringify(finalMap, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  }
getGoogle();

