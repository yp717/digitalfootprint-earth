import Graphic from "@arcgis/core/Graphic"

function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1
  // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

export const generatePoints = () => {
  const cdnLocations = []
  for (var i = 0; i < 5; ++i) {
    const [latitude, longitude] = [
      getRandomInRange(-90, 90, 3),
      getRandomInRange(-180, 180, 3),
    ]
    cdnLocations.push({
      latitude,
      longitude,
    })
  }
  return cdnLocations
}

export const redrawElements = (
  mapRef,
  // centralServerLocation,
  cdnLocations,
  hovered,
  setHovered
) => {
  mapRef.current.graphics.removeAll()
  // const point = {
  //   type: "point", // autocasts as new Point()
  //   latitude: centralServerLocation.latitude,
  //   longitude: centralServerLocation.longitude,
  // }
  // // Create a symbol for drawing the point
  // const markerSymbol = {
  //   type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
  //   color: [245, 102, 66],
  //   outline: {
  //     // autocasts as new SimpleLineSymbol()
  //     color: [245, 102, 66],
  //     width: 4,
  //   },
  // }

  // // Create a graphic and add the geometry and symbol to it
  // const mainHubGraphic = new Graphic({
  //   geometry: point,
  //   symbol: markerSymbol,
  // })

  const cdnGraphics = []
  cdnLocations.forEach(({ latitude, longitude, total }, i) => {
    const point = {
      type: "point", // autocasts as new Point()
      latitude,
      longitude,
    }

    const pointID = `point-${i}`
    const size = total ? (11 - (11/(total*0.5))):  10
    // Create a symbol for drawing the point
    const markerSymbol = {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      color: hovered !== "" && hovered !== pointID ? [252, 211, 77, 0.2] : [252, 211, 77],
      size: size,
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [252, 211, 77],
        width:  1,
        opacity: hovered !== "" && hovered !== pointID ? 0.5 : 1
      },
    }

    // Create a graphic and add the geometry and symbol to it
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
      attributes: {
        id: pointID,
        type: "Point",
        index: i,
        onClick: () => {
          setHovered("")
          mapRef.current.goTo(
            { target: [longitude, latitude], zoom: 4 },
            { duration: 2000 }
          )
        },
      },
    })

    cdnGraphics.push(pointGraphic)

    // const polyline = {
    //   type: "polyline", // autocasts as new Polyline()
    //   paths: [
    //     [centralServerLocation.longitude, centralServerLocation.latitude],
    //     [longitude, latitude],
    //   ],
    // }

    // const lineID = `polyline-${i}`
    // // Create a symbol for drawing the line
    // const lineSymbol = {
    //   type: "simple-line", // autocasts as SimpleLineSymbol()
    //   color: hovered === lineID ? [255, 231, 153] : [252, 211, 77],
    //   width: hovered === lineID ? 5 : 4,
    // }

    // const polylineGraphic = new Graphic({
    //   geometry: polyline,
    //   symbol: lineSymbol,
    //   attributes: {
    //     id: lineID,
    //     type: "Line",
    //     index: i,
    //     position: [longitude, latitude],
    //     onClick: () => {
    //       setHovered("")
    //       const [viewLat, viewLong] = [
    //         mapRef.current.center.latitude,
    //         mapRef.current.center.longitude,
    //       ]
    //       const distToCDN = Math.sqrt(
    //         Math.pow(viewLat - latitude, 2) + Math.pow(viewLong - longitude, 2)
    //       )
    //       const distToServer = Math.sqrt(
    //         Math.pow(viewLat - centralServerLocation.latitude, 2) +
    //           Math.pow(viewLong - centralServerLocation.longitude, 2)
    //       )
    //       if (distToCDN > distToServer) {
    //         mapRef.current.goTo(
    //           { target: [longitude, latitude], zoom: 2 },
    //           { duration: 2000 }
    //         )
    //       } else {
    //         mapRef.current.goTo(
    //           {
    //             target: [
    //               centralServerLocation.longitude,
    //               centralServerLocation.latitude,
    //             ],
    //             zoom: 1,
    //           },
    //           { duration: 2000 }
    //         )
    //       }
    //     },
    //   },
      // popupTemplate: {
      // autocasts as new PopupTemplate()
      //   title: "{Name}",
      //   content: [
      //     {
      //       type: "fields",
      //       fieldInfos: [
      //         {
      //           fieldName: "Name",
      //         },
      //         {
      //           fieldName: "Owner",
      //         },
      //         {
      //           fieldName: "Length",
      //         },
      //       ],
      //     },
      //   ],
      // },
    // })
    // cdnGraphics.push(polylineGraphic)
  })
  mapRef.current.graphics.addMany([...cdnGraphics])
}
