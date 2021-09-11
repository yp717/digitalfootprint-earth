import React, { useEffect, useState } from "react"
import { useStory } from "../context/story-context"
import SearchBar from "./SearchBar"
import Logo from "../assets/Logo"
import ValidationWarning from "./ValidationWarning"

const SearchUI = () => {
  const {
    mapLoaded,
    submitted,
    ready,
    validationError,
    setValidationError,
    setGeoLocationOverlook,
    showLocationRequest,
  } = useStory()

  const [data, setData] = useState("...")
  useEffect(() => {
    async function fetchData() {
      const request = await fetch(`https://cdnhatch-api.onrender.com/stats`)
      const data = await request.json()
      setData(`${data.auditCount}+`)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setValidationError(false), 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [validationError, setValidationError])

  return mapLoaded && !submitted && !ready ? (
    <>
      {showLocationRequest ? (
        <div className="absolute z-30 h-full w-full top-0 left-0 px-2">
          <div className="flex flex-col items-center justify-center w-full h-full space-y-3">
            <div className="bg-space p-5 rounded">
              <h2 className="text-lg md:text-2xl text-white max-w-lg text-center">
                Location Request
              </h2>
              <p>
                We can make this story more personal if you enable location
                services. We do not store your location or any identifying
                information.
              </p>
              <button onClick={() => {setGeoLocationOverlook(true) }}>Procceed Without Enabling</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute z-30 h-full w-full top-0 left-0 px-2">
          <div className="flex flex-col items-center justify-center w-full h-full space-y-3">
            <Logo className="h-8 w-8 md:h-12 md:w-12 text-yellow-400" />
            <h1 className="text-2xl md:text-4xl font-bold text-white max-w-lg text-center">
              Translating Digital Footprints into Real World Effects.
            </h1>
            <div className="relative w-full mx-auto max-w-sm md:max-w-lg flex flex-col items-center">
              <SearchBar />
              <div className="absolute top-0 mt-16 mx-auto flex ">
                {validationError && <ValidationWarning />}
              </div>
            </div>
            <p className="text-lg font-medium">{data} Webpages Analyzed</p>
          </div>
        </div>
      )}
    </>
  ) : (
    ""
  )
}

export default SearchUI
