const fetch = require("node-fetch")
const data = require("./database.json")

async function bigPing(){
    for (const {domain} of data) {
        const result = await fetch(`https://cdnhatch-api.onrender.com/audit/${domain}`);
        console.log(result);
      }
}

bigPing()