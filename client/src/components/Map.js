import React, { useRef, useEffect } from "react"
import SceneView from "@arcgis/core/views/SceneView"
import WebMap from "@arcgis/core/WebMap"
import Basemap from "@arcgis/core/Basemap"
import * as watchUtils from "@arcgis/core/core/watchUtils"
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer"

const mapIsHidden = false

function debounce(func, timeout = 100) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

const Map = ({ mapRef, webMapRef, setIsLoaded, setHovered }) => {
  const mapDiv = useRef(null)
  useEffect(() => {
    if (mapDiv.current && !mapIsHidden) {
      const vectorTileLayer = new VectorTileLayer({
        portalItem: {
          id: "f3a55a52222341a7aafc793174351bb8", // Forest and Parks Canvas
        },
        opacity: 1,
      })

      const basemap = new Basemap({
        baseLayers: [vectorTileLayer],
      })
      const webmap = new WebMap({
        portalItem: {
          id: "aa1d3f80270146208328cf66d022e09c",
        },
        basemap: basemap,
      })

      webMapRef.current = webmap

      const view = new SceneView({
        container: mapDiv.current,
        map: webmap,
        scale: 500000000,
        center: [-121.5267, 41.8868],
        environment: {
          background: {
            type: "color", // autocasts as new ColorBackground()
            color: [1, 11, 20, 1],
          },
          // disable stars
          starsEnabled: true,
          //disable atmosphere
          atmosphereEnabled: true,
        },
        highlightOptions: {
          color: "orange",
        },
      })
      watchUtils.when(view, "map.loaded", () =>
        setTimeout(() => setIsLoaded(true), 1000)
      )

      view.on("click", function (event) {
        view.hitTest(event).then(function (response) {
          if (response.results.length) {
            const graphic = response.results[0].graphic
            if (graphic.attributes && graphic.attributes.onClick) {
              graphic.attributes.onClick()
              document.body.style.cursor = "default"
            }
          }
        })
      })

      view.on("pointer-move", function (event) {
        view.hitTest(event).then(
          debounce(response => {
            document.body.style.cursor = "default"
            if (response.results.length) {
              const graphic = response.results[0].graphic
              if (graphic.attributes && graphic.attributes.id) {
                setHovered(graphic.attributes.id)
                document.body.style.cursor = "pointer"
              } else {
                setHovered("")
                // document.body.style.cursor = 'default';
              }
            } else {
              setHovered("")
            }
          })
        )
      })

      mapRef.current = view
    }
  }, [mapRef, setHovered, setIsLoaded])

  return (
    <div className="w-full h-full relative">
      <div className="mapDiv w-full h-full focus:outline-none" ref={mapDiv} />
    </div>
  )
}

// const LoadableMap = Loadable(() => import("./Map"))
export default Map
