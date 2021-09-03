import "./src/styles/global.css"
import React from "react"
import { HelmetProvider } from "react-helmet-async"

export const wrapRootElement = ({ element, props }) => {
  return <HelmetProvider>{element}</HelmetProvider>
}
