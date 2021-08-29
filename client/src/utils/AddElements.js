import Graphic from "@arcgis/core/Graphic"

// function getRandomInRange(from, to, fixed) {
//   return (Math.random() * (to - from) + from).toFixed(fixed) * 1
//   // .toFixed() returns string, so ' * 1' is a trick to convert to number
// }

export const redrawElements = (
  mapRef,
  // centralServerLocation,
  points,
  lines,
  hovered,
  setHovered
) => {
  mapRef.current.graphics.removeAll()

  const cdnGraphics = []
  points.forEach(({ latitude, longitude, total }, i) => {
    const point = {
      type: "point", // autocasts as new Point()
      latitude,
      longitude,
    }

    const pointID = `point-${i}`
    const size = total ? 11 - 11 / (total * 0.5) : 10
    // Create a symbol for drawing the point
    const markerSymbol = {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      color:
        hovered !== "" && hovered !== pointID
          ? [252, 211, 77, 0.2]
          : [252, 211, 77],
      size: size,
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [252, 211, 77],
        width: 1,
        opacity: hovered !== "" && hovered !== pointID ? 0.5 : 1,
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
  })
  lines.forEach(({ start, end }, i) => {
    const polyline = {
      type: "polyline", // autocasts as new Polyline()
      paths: [
        [start.longitude, start.latitude],
        [end.longitude, end.latitude],
      ],
    }
    const lineID = `polyline-${i}`
    // Create a symbol for drawing the line
    const lineSymbol = {
      type: "simple-line", // autocasts as SimpleLineSymbol()
      color: hovered === lineID ? [255, 231, 153] : [252, 211, 77],
      width: hovered === lineID ? 5 : 4,
    }
    const polylineGraphic = new Graphic({
      geometry: polyline,
      symbol: lineSymbol,
      attributes: {
        id: lineID,
        type: "Line",
        index: i,
        position: [end.longitude, end.latitude],
        onClick: () => {
          setHovered("")
          const [viewLat, viewLong] = [
            mapRef.current.center.latitude,
            mapRef.current.center.longitude,
          ]
          const distToCDN = Math.sqrt(
            Math.pow(viewLat - end.latitude, 2) +
              Math.pow(viewLong - end.longitude, 2)
          )
          const distToServer = Math.sqrt(
            Math.pow(viewLat - start.latitude, 2) +
              Math.pow(viewLong - start.longitude, 2)
          )
          if (distToCDN > distToServer) {
            mapRef.current.goTo(
              { target: [end.longitude, end.latitude], zoom: 2 },
              { duration: 2000 }
            )
          } else {
            mapRef.current.goTo(
              {
                target: [start.longitude, start.latitude],
                zoom: 1,
              },
              { duration: 2000 }
            )
          }
        },
      },
      popupTemplate: {
        title: "{Name}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "Name",
              },
              {
                fieldName: "Owner",
              },
              {
                fieldName: "Length",
              },
            ],
          },
        ],
      },
    })
    cdnGraphics.push(polylineGraphic)
  })

  mapRef.current.graphics.addMany([...cdnGraphics])
}
