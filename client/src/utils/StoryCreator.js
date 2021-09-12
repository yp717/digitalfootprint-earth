import { getDistance, getDistanceInKM } from "./locationUtils"

const defaultStoryItem = {
  hero: false,
  overlay: false,
  overlayColor: "text-white",
  title: "",
  body: "",
  rotate: false,
  small: false,
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
  const {
    hosted_by,
    green,
    url,
    data: greenData,
  } = data.environmentalData.greenWebFoundation
  const { saPolygons } = data.serviceArea
  const { totalSize } = data.performance
  const { hosting, pageWeight, performance, total } = data.auditScores

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
  } else {
    storyItems.push({
      ...defaultStoryItem,
      title: "CDN Networks",
      body: `While we couldn't find this sites exact Content Delivery Network (CDN), Akamai is a great example. Akamai has servers in ${data.exampleCdnLoc.length} locations around the globe serving requests every second.`,
      goTo: {
        target: [data.requestData.lon, data.requestData.lat],
        zoom: 3,
        duration:
          15 * (1 / getDistance(data.userInfo, data.requestData)) - 3 < 1
            ? 100
            : 2000,
      },
      rotate: false,
      points: data.exampleCdnLoc.map(item => ({
        latitude: item.lat,
        longitude: item.lon,
      })),
    })
  }

  ////////// PART 4: Analysis specific to individual //////////
  const carbon = ((totalSize * 10) / 1024 / 1024).toFixed(2)

  storyItems.push({
    ...defaultStoryItem,
    hero: true,
    title: `Each visit produces ${carbon}g of CO2`,
    body: `sending ${(totalSize / 1024 / 1024).toFixed(
      2
    )} MB of data. Every time.`,
    rotate: true,
    goTo: {
      zoom: 1,
      duration: 2000,
    },
  })

  if (typeof data.geoLocation !== "undefined") {
    storyItems.push({
      ...defaultStoryItem,
      title: `${carbon}g of carbon`,
      body: `You could travel by car this far and release the same amount.`,
      serviceArea: saPolygons,
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
    body: `Millions of requests are made every second to over 1.8 billion websites.`,
    rotate: false,
    goTo: {
      target: [51.5074, 0.1278],
      zoom: 1,
      duration: 2000,
    },
    points: data.exampleCdnLoc.map(item => ({
      latitude: item.lat,
      longitude: item.lon,
    })),
    lines: data.exampleCdnLoc
      .map((item, index) => {
        if (index <= data.exampleCdnLoc.length - 3 && index % 2 === 0) {
          return {
            color: [245, 158, 11, 0.6],
            start: { latitude: item.lat, longitude: item.lon },
            end: {
              latitude: data.exampleCdnLoc[index + 2].lat,
              longitude: data.exampleCdnLoc[index + 2].lon,
            },
          }
        }
        return null
      })
      .filter(item => item !== null),
  })

  // finished up to here
  ////////// PART 5: ... //////////

  storyItems.push({
    ...defaultStoryItem,
    title:
      "This map shows the CO2 emissions per capita by country. Every single request to a website produces CO2 - producing more combined emissions than all countries except the US and China, more than the entire airline industry anually and almost as much as the production and inciniration of plastic.",
    rotate: true,
    layers: ["CO2"],
  })

  storyItems.push({
    ...defaultStoryItem,
    hero: true,
    title: "So what can we do?",
    rotate: true,
  })

  // Green Evaluation
  if (green) {
    storyItems.push({
      ...defaultStoryItem,
      hero: true,
      small: true,
      showHostingScore: hosting + "",
      title: `${url} is hosted by a green hosting provider.`,
      body: `This URL is hosted on ${hosted_by}, which the Green Web Foundation considers green.`,
      rotate: true,
    })
  } else {
    if (greenData === false) {
      storyItems.push({
        ...defaultStoryItem,
        hero: true,
        small: true,
        showHostingScore: hosting + "",
        title: `${url}'s hosting could not be identified as green.`,
        body: `We were not able to identify whether this ${url}'s hosting is green. Switching to a green hosting provider would be a great start if you are not already using one.`,
        rotate: true,
      })
    } else {
      storyItems.push({
        ...defaultStoryItem,
        hero: true,
        small: true,
        showHostingScore: hosting + "",
        title: `${url}'s hosting could be greener.`,
        body: hosted_by
          ? `This URL is hosted on ${hosted_by}, which the Green Web Foundation considers not to be green. Switching to a green hosting provider would be a great start.`
          : `The Green Web Foundation considers the hosting provider of ${url} not to be green. Switching to a green hosting provider would be a great start.`,
        rotate: true,
      })
    }
  }

  // Performance
  let perfBodyText = ""
  switch (performance) {
    case 0 || 1:
      perfBodyText = `${url} achieved a below average performance score. Improving this websites performance could significantly reduce its carbon footprint.`
      break
    case 2:
      perfBodyText = `${url} achieved an average performance score. Any steps taken to further improve this sites could significantly reduce your carbon footprint and improve user experience with faster load times.`
      break
    case 3:
      perfBodyText = `${url} achieved an excellent performance score. This means that ...`
      break
    default:
      console.error("received invalid performance score")
      perfBodyText = `A performance score could not be computed for this website.`
      break
  }

  storyItems.push({
    ...defaultStoryItem,
    hero: true,
    small: true,
    showHostingScore: hosting + "",
    showPerformanceScore: performance + "",
    title: `${url} achieves a ${performance}/3 performance score.`,
    body: perfBodyText,
    rotate: true,
  })

  // Page Size
  let pageSizeText = ""
  switch (pageWeight) {
    case 3:
      pageSizeText = `${url} has a small page weight!`
      break
    case 2:
      pageSizeText = `${url} has an above average page weight. This suggests that there is potentially some unoptimized JavaScript or multimedia content.`
      break
    case 1:
      pageSizeText = `${url} has a heavy page weight. This suggests that there is potentially a lot of unoptimized JavaScript or multimedia content.`
      break
    default:
      pageSizeText = `${url} has a very heavy page weight and produces more than double the CO2 produced by the average site. This suggests you may have a lot of unoptimized JavaScript or multimedia content.`
      break
  }

  storyItems.push({
    ...defaultStoryItem,
    hero: true,
    small: true,
    showHostingScore: hosting + "",
    showPerformanceScore: performance + "",
    showPageWeightScore: pageWeight + "",
    title: `${url} achieves a ${pageWeight}/3 page weight score.`,
    body: `${pageSizeText}. The smaller you can make your page weight the less energy required to transfer it so try and keep it small.`,
    rotate: true,
  })

  return storyItems
}

export default StoryCreator

// If you own this site, there are a number of steps you can take to make your site greener!
// If not, there are still steps you can take to be a greener digital citizen
