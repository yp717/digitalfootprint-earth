import React, { useEffect, useState } from "react"
import { useStory } from "../context/story-context"
import SearchBar from "./SearchBar"
import Logo from "../assets/Logo"
import ValidationWarning from "./ValidationWarning"

const SearchUI = () => {
  const { mapLoaded, submitted, ready, validationError, setValidationError } =
    useStory()

    const [data, setData] = useState("...")
    useEffect(async () => {
      const request = await fetch(`https://cdnhatch-api.onrender.com/stats`)
      const data = await request.json()
      setData(`${data.auditCount}+`)
    }, [])

  useEffect(() => {
    const timer = setTimeout(() => setValidationError(false), 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [validationError, setValidationError])

  return mapLoaded && !submitted && !ready ? (
    <>
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
    </>
  ) : (
    ""
  )
}

export default SearchUI
