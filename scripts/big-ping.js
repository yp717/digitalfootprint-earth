import fetch from "node-fetch";
import Data from "./database.json";

async function bigPing() {
  let count = 0;
  for (const { domain } of Data) {
    if (count >= 0) {
      console.log(`Loading ${count}/${Data.length}: ${domain}`);
      try {
        const controller = new AbortController()
        const signal = controller.signal
        const timeout = setTimeout(() => {
          console.log("Failed.") 
          controller.abort()
        }, 80000)
        await fetch(
          `http://cdnhatch-api.onrender.com/audit/${domain}`,
          { signal }
        );
        clearTimeout(timeout)
        count++;
      } catch(e){
        // console.log(e)
        count++;
      }
    } else {
      count ++;
    }
  }
}

bigPing();
