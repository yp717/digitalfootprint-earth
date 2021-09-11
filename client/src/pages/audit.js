import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { Match } from "@reach/router"
import { navigate } from "gatsby"
import Header from "../components/core/Header"
import ScoreTimeline from "../components/ScoreTimeline"
import SEO from "../components/core/SEO"

const AuditPage = ({ url }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState()

  useEffect(() => {
    async function fetchData() {
      const request = await fetch(`https://api.digitalfootprint.earth/audit/${url}`)
      const data = await request.json()
      setData(data)
      setLoading(false)
    }
    fetchData()
  }, [url])

  if (loading) {
    return (
      <div className="absolute z-30 h-full w-full top-0 left-0">
        <SEO title="Audit" description={`Audit Results for ${url}`} />
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
  const {
    // requestData,
    environmentalData: {
      greenWebFoundation: { green, hosted_by, hosted_by_website },
    },
    auditScores: { hosting, pageWeight, performance, total },
    cdnInfo: { cdnProvider, cdnLocations },
    performance: { performanceScore, totalSize },
  } = data
  return (
    <div className="max-w-4xl mx-auto space-y-2 py-12 md:py-24 px-5">
      <div>
        <p>AUDIT RESULTS</p>
        <h1 className="text-4xl md:text-7xl text-yellow-400 font-bold pb-2">{url}</h1>
      </div>
      <div className="grid gap-4">
        <div className="bg-gray-800 rounded p-4 w-full h-full ">
          <div className="flex justify-between items-center border-b-4 border-gray-700 pb-2 mb-2 text-xl md:text-3xl text-gray-100 font-bold">
            <p>Performance</p>
            <p>{performance}/3</p>
          </div>
          <div>
            <p>
              Your site has a Lighthouse performance score of {performanceScore}
              %.
            </p>
          </div>
        </div>
        <div className="bg-gray-800 rounded p-4 w-full h-full ">
          <div className="flex justify-between items-center border-b-4 border-gray-700 pb-2 mb-2 text-xl md:text-3xl text-gray-100 font-bold">
            <p>Page Size</p>
            <p>{pageWeight}/3</p>
          </div>
          <div>
            <p>
              Your site has a page size of{" "}
              {(totalSize / (1024 * 1024)).toFixed(2)}MB.
            </p>
          </div>
        </div>
        <div className="bg-gray-800 rounded p-4 w-full h-full ">
          <div className="flex justify-between items-center border-b-4 border-gray-700 pb-2 mb-2 text-xl md:text-3xl text-gray-100 font-bold">
            <p>Hosting</p>
            <p>{hosting}/3</p>
          </div>
          <div>
            <p>Hosted By: {hosted_by}</p>
            <p>Website: {hosted_by_website}</p>
            <p>Considered to be {green ? "green" : "not green"}</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded p-4 w-full h-full ">
          <div className="flex justify-between items-center border-b-4 border-gray-700 pb-2 mb-2 text-xl md:text-3xl text-gray-100 font-bold">
            <p>Additional Info</p>
          </div>
          <div>
            <p>CDN Provider: {cdnProvider}</p>
            <p>CDN Server Locations: {cdnLocations.length}</p>
          </div>
        </div>
       
        <div className="bg-yellow-400 text-gray-800 rounded p-4 w-full h-full flex justify-between items-center text-xl md:text-3xl font-bold">
          <p>Our Score</p>
          <p>{total}/9</p>
        </div>
        <div className="bg-gray-800 rounded py-4 pr-4 w-full">
        <div className="flex justify-between items-center border-b-4 ml-4 border-gray-700 pb-2 mb-2 text-xl md:text-3xl text-gray-100 font-bold">
            <p>Results Over Time</p>
          </div>
        <ScoreTimeline url={url} />
        </div>
        
        <div className="grid md:grid-cols-2">
          <Link to="/">See your personal story with {url}.</Link>
        </div>
      </div>
    </div>
  )
}

function Audit() {
  return (
    <div>
      <Header />
      <Match path="/audit/:eventId">
        {props =>
          props.match ? (
            <AuditPage url={props.match.eventId} />
          ) : (
            typeof window !== "undefined" && navigate("/")
          )
        }
      </Match>
    </div>
  )
}

export default Audit
