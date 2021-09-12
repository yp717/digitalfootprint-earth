import fs from "fs";
// import fetch from "node-fetch"

// function timeout(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// const regexp = /\w+, \w+/g
// let places = []
// const data = fs.readFileSync("cloudflareLocations.txt", "utf8");
// places = [...data.match(regexp)].map(item => item.replace(" ", ""));

// const placesWithLats = []
// async function gatherLats () {
//     let  count = 1
//     for (const place of places) {
//         console.log(`${count}/${places.length-1}`)
//       await timeout(1100)
//       const req = await fetch(`https://geocode.xyz/${place}?json=1`).then(res => res.json());
//       placesWithLats.push({place, lon: req.longt, lat: req.latt })
//       count ++
//     }
//     try {
//         const data = fs.writeFileSync('cloudflare-servers.json', JSON.stringify(placesWithLats, null, 2))
//         //file written successfully
//       } catch (err) {
//         console.error(err)
//       }
      
//   }

//   gatherLats()


const data = fs.readFileSync("cloudflare-servers.json", "utf8");
const json = JSON.parse(data)

json.filter(({lat,lon}) => lat && lon)
fs.writeFileSync('cloudflare-servers.json', JSON.stringify(json.filter(({lat,lon}) => lat && lon), null, 2))