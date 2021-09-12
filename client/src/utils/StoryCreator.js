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
  serviceArea: [],
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
  const { saPolygons } = data.serviceArea
  const { totalSize } = data.performance

  console.log({ data })

  ////////// PART 1: Story Introduction //////////
  if (typeof data.geoLocation === "undefined") {
    storyItems.push({
      ...defaultStoryItem,
      title: "It all starts with you.",
      body: `Your request to ${url} started from your laptop and was routed via your ISP - ${isp} in ${city}.`,
      goTo: {
        target: [data.userInfo.lon, data.userInfo.lat],
        zoom: 5,
        duration: 2000,
      },
      points: [{ latitude: data.userInfo.lat, longitude: data.userInfo.lon }],
    })
  } else {
    const ISPDistance = getDistanceInKM(data.userInfo, data.geoLocation)
    storyItems.push({
      ...defaultStoryItem,
      title: "It all starts with you.",
      body: `Your request to ${url} started with you in ${city}. Your request was routed via your ISP - ${isp}. This distance is equivalent to ${Math.floor(
        (ISPDistance * 1000) / 50
      )} olympic-sized swimming pools end-to-end.`,
      goTo: {
        target: [data.userInfo.lon, data.userInfo.lat],
        zoom: 15 * (1 / getDistance(data.userInfo, data.geoLocation)),
        duration: 2000,
      },
      points: [
        { latitude: data.userInfo.lat, longitude: data.userInfo.lon },
        { latitude: data.geoLocation.lat, longitude: data.geoLocation.lon },
      ],
      lines: [
        {
          start: { latitude: data.userInfo.lat, longitude: data.userInfo.lon },
          end: {
            latitude: data.geoLocation.lat,
            longitude: data.geoLocation.lon,
          },
        },
      ],
    })
  }

  ////////// PART 2: CDN Locations //////////
  if (cdnProvider !== "UNKNOWN") {
    const CDNDistance = getDistanceInKM(data.userInfo, data.requestData)
    storyItems.push({
      ...defaultStoryItem,
      title: `Routed through ${cdnProvider}'s CDN`,
      body: `Your request was then fulfilled by a Content Delivery Network (CDN) owned by ${cdnProvider} who sit in front of ${url}. It takes the network ${networkLatency}ms to make the ${Math.floor(
        CDNDistance
      )}km journey there and back. It would take you ${Math.floor(
        CDNDistance / 5
      )} hours to walk that far!`,
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

    console.log({ cdnLocations })
    storyItems.push({
      ...defaultStoryItem,
      title: "The CDN Network",
      body: `${cdnProvider} has servers in ${cdnLocations.length} locations around the globe serving requests every second.`,
      goTo: {
        target: [data.requestData.lon, data.requestData.lat],
        zoom: 3,
        duration:
          15 * (1 / getDistance(data.userInfo, data.requestData)) - 3 < 1
            ? 100
            : 2000,
      },
      rotate: false,
      points: cdnLocations.map(item => ({
        latitude: item.lat,
        longitude: item.lon,
      })),
    })
    // finished up to here
  } else {
    // TODO: While we couldn't find this sites exact CDN. Akamai is a great example of a typical CDN
    // When you visit a website, your request
    const sample_cdn_locs = Object.entries(data.exampleCdnLoc)

    storyItems.push({
      ...defaultStoryItem,
      title: "CDN Networks",
      body: `While we couldn't find this sites exact Content Delivery Network (CDN), Akamai is a great example. Akamai has servers in ${sample_cdn_locs.length} locations around the globe serving requests every second.`,
      goTo: {
        target: [data.requestData.lon, data.requestData.lat],
        zoom: 3,
        duration:
          15 * (1 / getDistance(data.userInfo, data.requestData)) - 3 < 1
            ? 100
            : 2000,
      },
      rotate: false,
      points: sample_cdn_locs.map(item => {
        console.log({ item })
        return {
          latitude: item.lat,
          longitude: item.lon,
        }
      }),
    })
  }

  ////////// PART 4: Analysis specific to individual //////////
  const carbon = ((totalSize * 10) / 1024 / 1024).toFixed(2)

  storyItems.push({
    ...defaultStoryItem,
    hero: true,
    title: `${carbon}g of CO2`,
    body: `are released every time your request this page.`,
    rotate: true,
    goTo: {
      zoom: 1,
      duration: 2000,
    },
  })

  // console.log(data.geoLocation)
  // console.log(data.userInfo)
  if (typeof data.geoLocation !== "undefined") {
    storyItems.push({
      ...defaultStoryItem,
      title: `${carbon}g of carbon`,
      body: `You could travel by car this far and release the same amount.`,
      serviceArea: saPolygons,
      // rotate: false,
      goTo: {
        target: [
          parseFloat(data.geoLocation.lon),
          parseFloat(data.geoLocation.lat),
        ],
        zoom: 12,
        duration: 2000,
      },
    })
  }

  ////////// PART 5: Analysis in context (It's not just you) //////////

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

  ////////// PART 5: ... //////////

  storyItems.push({
    ...defaultStoryItem,
    title: "All of which are producing CO2",
    rotate: true,
    layers: ["CO2"],
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
      showHostingScore: true,
      title: `${url} is hosted green.`,
      body: `This URL is hosted on ${hosted_by} which the Green Web Foundation considers green.`,
      rotate: true,
    })
  } else {
    storyItems.push({
      ...defaultStoryItem,
      showHostingScore: true,
      title: `${url}'s hosting could be greener.`,
      body: `This URL is hosted on ${hosted_by} which the Green Web Foundation considers not to be green. Switching to a green hosting provider would be a great start.`,
      rotate: true,
    })
  }

  return storyItems
}

export default StoryCreator
