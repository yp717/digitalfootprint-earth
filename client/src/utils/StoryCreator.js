import { getDistance, getDistanceInKM } from "./locationUtils"

const defaultStoryItem = {
  hero: false,
  overlay: false,
  title: "",
  body: "",
  rotate: false,
  layers: [],
  points: [],
  lines: [],
  showTotalScore: false,
  showPageWeightScore: false,
  showPerformanceScore: false,
  showHostingScore: false,
}

const StoryCreator = data => {
  let storyItems = []
  const { networkLatency } = data.requestData
  const { cdnProvider, cdnLocations } = data.cdnInfo
  const { city, isp } = data.userInfo
  const { hosted_by, green, url } = data.environmentalData.greenWebFoundation
  // storyItems.push({
  //   ...defaultStoryItem,
  //   hero: true,
  //   title: "You're Stor",
  //   body: `It's sub content`,
  //   rotate: true,
  //   goTo: {
  //     target: [data.userInfo.lon, data.userInfo.lat],
  //     zoom: 1,
  //     duration: 2000,
  //   },
  // })
  storyItems.push({
    ...defaultStoryItem,
    title: "It all starts with you.",
    body: `Your request to ${url} started with you in ${city}. It was routed via your ISP - ${isp}.`,
    goTo: {
      target: [data.userInfo.lon, data.userInfo.lat],
      zoom: 5,
      duration: 2000,
    },
    points: [{ latitude: data.userInfo.lat, longitude: data.userInfo.lon }],
  })

  storyItems.push({
    ...defaultStoryItem,
    title: "Routed to a CDN",
    body: `Your request was then fulfilled by a CDN owned by ${cdnProvider} who sit in front of ${url}. It takes the network ${networkLatency}ms to make the ${Math.floor(
      getDistanceInKM(data.userInfo, data.requestData)
    )}km journey there and back.`,
    goTo: {
      target: [data.requestData.lon, data.requestData.lat],
      zoom: 15 * (1 / getDistance(data.userInfo, data.requestData)),
      duration: 2000,
    },
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
    ...defaultStoryItem,
    hero: true,
    title: "But it's not just you.",
    body: `Millions of requests are made every second.`,
    rotate: true,
    goTo: {
      // target: [data.userInfo.lon, data.userInfo.lat],
      zoom: 1,
      duration: 2000,
    },
  })
  storyItems.push({
    ...defaultStoryItem,
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
  })
  storyItems.push({
    ...defaultStoryItem,
    title: "All of which are producing CO2",
    rotate: true,
    layers: ["CO2"],
    points: cdnLocations.map(item => ({
      latitude: item.lat,
      longitude: item.lon,
    })),
  })
  storyItems.push({
    ...defaultStoryItem,
    hero: true,
    title: "So what can we do?",
    rotate: true,
  })
  if (green) {
    storyItems.push({
      ...defaultStoryItem,
      showHostingScore:true,
      title: `${url} is hosted green.`,
      body: `This URL is hosted on ${hosted_by} which the Green Web Foundation considers green.`,
      rotate: true,
    })
  } else {
    storyItems.push({
      ...defaultStoryItem,
      showHostingScore:true,
      title: `${url}'s hosting could be greener.`,
      body: `This URL is hosted on ${hosted_by} which the Green Web Foundation considers not to be green. Switching to a green hosting provider would be a great start.`,
      rotate: true,
    })
  }

  return storyItems
}

export default StoryCreator
