export default function (data) {
  let storyItems = []
  const { url } = data.requestData
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
  storyItems.push({
    title: "Routed to a CDN",
    body: `Your request was then fulfilled by a CDN owned by ${cdnProvider} who sit in front of ${url}.`,
    goTo: {
      target: [data.requestData.lon, data.requestData.lat],
      zoom: 3,
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
      duration: 100,
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
