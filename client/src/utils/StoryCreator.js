import { getDistance, getDistanceInKM } from "./locationUtils"

const StoryCreator = data => {
  let storyItems = []
  console.log(data)
  const { networkLatency } = data.requestData
  const { cdnProvider, cdnLocations } = data.cdnInfo
  const { city, isp } = data.userInfo
  const { hosted_by, green, url } = data.environmentalData.greenWebFoundation
  // storyItems.push({
  //   hero: true,
  //   title: "You're Stor",
  //   body: `It's sub content`,
  //   rotate: true,
  //   goTo: {
  //     target: [data.userInfo.lon, data.userInfo.lat],
  //     zoom: 1,
  //     duration: 2000,
  //   },
  //   layers: [],
  //   points: [],
  //   lines: [],
  // })
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
    body: `Your request was then fulfilled by a CDN owned by ${cdnProvider} who sit in front of ${url}. It takes the network ${networkLatency}ms to make the ${Math.floor(
      getDistanceInKM(data.userInfo, data.requestData)
    )}km journey there and back.`,
    goTo: {
      target: [data.requestData.lon, data.requestData.lat],
      zoom: 15 * (1 / getDistance(data.userInfo, data.requestData)),
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
    hero: true,
    title: "But it's not just you.",
    body: `Millions of requests are made every second.`,
    rotate: true,
    goTo: {
      // target: [data.userInfo.lon, data.userInfo.lat],
      zoom: 1,
      duration: 2000,
    },
    layers: [],
    points: [],
    lines: [],
  })
  storyItems.push({
    title: "The CDN Network",
    body: `${cdnProvider} has CDN servers in ${cdnLocations.length} locations around the globe serving requests every minute.`,
    goTo: {
      target: [data.requestData.lon, data.requestData.lat],
      zoom: 3,
      duration:
        15 * (1 / getDistance(data.userInfo, data.requestData)) - 3 < 1
          ? 100
          : 2000,
    },
    rotate: true,
    points: cdnLocations.map(item => ({
      latitude: item.lat,
      longitude: item.lon,
    })),
    lines: [],
  })
  storyItems.push({
    title: "All of which are producing CO2",
    body: ``,
    rotate: true,
    layers: ["CO2"],
    points: cdnLocations.map(item => ({
      latitude: item.lat,
      longitude: item.lon,
    })),
    lines: [],
  })
  storyItems.push({
    hero: true,
    title: "So what can we do?",
    body: ``,
    rotate: true,
    layers: [],
    points: [],
    lines: [],
  })
  if (green) {
    storyItems.push({
      title: `${url} is hosted green.`,
      body: `This URL is hosted on ${hosted_by} which the Green Web Foundation considers green.`,
      rotate: true,
      layers: [],
      points: [],
      lines: [],
    })
  } else {
    storyItems.push({
      title: `${url}'s hosting could be greener.`,
      body: `This URL is hosted on ${hosted_by} which the Green Web Foundation considers not to be green. Switching to a green hosting provider would be a great start.`,
      rotate: true,
      layers: [],
      points: [],
      lines: [],
    })
  }

  return storyItems
}

export default StoryCreator
