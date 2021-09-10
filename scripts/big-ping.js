import fetch from "node-fetch";
import Data from "./database.json";

async function bigPing() {
  let count = 1;
  for (const { domain } of Data) {
    if (count >= 30) {
      console.log(`Loading ${count}/${Data.length}: ${domain}`);
      const result = await fetch(
        `http://cdnhatch-api.onrender.com/audit/${domain}`
      );
      count++;
    }
  }
}

bigPing();
