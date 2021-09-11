import React, { useEffect } from "react"
import { Link } from "gatsby"
import Header from "../components/core/Header"
import { useState } from "react"
import ProportionGreen from "../components/visualizations/ProportionGreen"
import PerformanceOverview from "../components/visualizations/PerformanceOverview"

const BiggerPicture = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState()

  useEffect(async () => {
    const request = await fetch(`https://cdnhatch-api.onrender.com/stats`)
    const newData = await request.json()
    setData(newData)
    setLoading(false)
  }, [])

  console.log(data)

  if (loading) {
    return (
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
            Gathering Statistics...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl h-screen text-white mx-auto mt-32">
        <div className="flex flex-col text-center">
          <h1 className="font-bold text-6xl mb-6">The Bigger Picture</h1>
          <p className="px-5 mb-6">
            None of this means anything without looking at the bigger picture.
          </p>
          {/* How much data is transferred over the web every second / year - big scary statistics */}
          {/* usage statistics of the platform - number audited on line chart  */}
          <ProportionGreen data={data} />
          <PerformanceOverview data={data} />

          {/* bar chart of the ten biggest sites on the web and their respective users */}
        </div>
      </div>
    </>
  )
}

export default BiggerPicture
