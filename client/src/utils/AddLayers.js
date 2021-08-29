import Layer from "@arcgis/core/layers/Layer"

function addLayers(webMapRef, layers) {
  layers.forEach(layer => {
    switch (layer) {
      case "CO2": {
        const renderer = {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            // symbol type required for rendering point geometries
            type: "point-3d", // autocasts as new PointSymbol3D()
            symbolLayers: [
              {
                // renders points as volumetric objects
                type: "object", // autocasts as new ObjectSymbol3DLayer()
                resource: { primitive: "cylinder" }, // renders points as cones
              },
            ],
          },
          visualVariables: [
            {
              type: "color",
              field: "annual_co2_emissions_per_capita",
              stops: [
                { value: 0, color: "#ffba08" },
                { value: 10, color: "#F48C06" },
                { value: 20, color: "#DC2F02" },
                { value: 30, color: "#D00000" },
              ],
            },
            {
              type: "size",
              field: "annual_co2_emissions_per_capita",
              stops: [{ value: 0, size: 20000 }],
              axis: "height",
            },
            {
              type: "size",
              axis: "width-and-depth",
              field: "annual_co2_emissions_per_capita",
              stops: [
                { value: 0, size: 500000 },
                { value: 10, size: 800000 },
                { value: 20, size: 1200000 },
                { value: 30, size: 1600000 },
              ], // uses the width value defined in the symbol layer (50,000)
            },
          ],
        }
        Layer.fromPortalItem({
          portalItem: {
            id: "07c40da15289498aac9310993b7c5e28",
          },
        }).then(layer => {
          layer.renderer = renderer
          layer.opacity = 0.4
          webMapRef.current.layers.add(layer)
        })
        break
      }
    }
  })
}

export default addLayers
