export default function (data) {
  let storyItems = []
  const { url, networkLatency } = data.requestData
  const { cdnProvider, cdnLocations } = data.cdnInfo
  const { city, country, isp } = data.userInfo
  storyItems.push({
    title: "It all starts with you.",
    body: `Your request to ${url} started with you in ${city}. It was routed via your ISP - ${isp}.`,
    goTo: {
      target: [data.userInfo.lon, data.userInfo.lat],
      zoom: 5,
      duration: 2000,
    },
    rotate: false,
    layers: [],
    points: [{ latitude: data.userInfo.lat, longitude: data.userInfo.lon }],
    lines: [],
  })
  var a = data.userInfo.lat - data.requestData.lat
  var b = data.userInfo.lon - data.requestData.lon

  var dist = Math.sqrt(a * a + b * b)
  console.log(dist)
  storyItems.push({
    title: "Routed to a CDN",
    body: `Your request was then fulfilled by a CDN owned by ${cdnProvider} who sit in front of ${url}. It takes the network ${networkLatency}ms to make the journey there and back.`,
    goTo: {
      target: [data.requestData.lon, data.requestData.lat],
      zoom: 15 * (1 / dist),
      duration: 2000,
    },
    rotate: false,
    layers: [],
    points: [
      { latitude: data.userInfo.lat, longitude: data.userInfo.lon },
      { latitude: data.requestData.lat, longitude: data.requestData.lon },
    ],
    lines: [
      {
        start: { latitude: data.userInfo.lat, longitude: data.userInfo.lon },
        end: {
          latitude: data.requestData.lat,
          longitude: data.requestData.lon,
        },
      },
    ],
  })

  storyItems.push({
    title: "The CDN Network",
    body: `${cdnProvider} has CDN servers in ${cdnLocations.length} locations around the globe.`,
    goTo: {
      target: [data.requestData.lon, data.requestData.lat],
      zoom: 3,
      duration: 15 * (1 / dist) -3 < 1 ? 100 : 2000,
    },
    rotate: true,
    layers: [],
    points: cdnLocations.map(item => ({
      latitude: item.lat,
      longitude: item.lon,
    })),
    lines: [],
  })

  return storyItems
}
