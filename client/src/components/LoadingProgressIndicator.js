import React from "react"

import { useStory } from "../context/story-context"

const LoadingProgressIndicator = () => {
  const { mapLoaded, submitted, ready } = useStory()

  return !mapLoaded || (submitted && !ready) ? (
    <div className="absolute z-30 h-full w-full top-0 left-0">
      <div className="flex flex-col items-center justify-center w-full h-full space-y-3">
        <svg
          className="animate-spin -ml-1 mr-3 h-16 w-16 md:h-24 md:w-24 text-yellow-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-lg md:text-2xl font-bold">
          {!mapLoaded
            ? "Preparing your experience..."
            : "Creating the story..."}
        </p>
      </div>
    </div>
  ) : (
    ""
  )
}

export default LoadingProgressIndicator
