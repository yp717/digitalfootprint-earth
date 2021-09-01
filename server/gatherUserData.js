const fetch = require("node-fetch");

async function gatherUserData(IP) {
  const userInfo = await fetch(`http://ip-api.com/json/${IP}`).then((res) =>
    res.json()
  );
  return userInfo;
}

module.exports = {
  gatherUserData,
};
