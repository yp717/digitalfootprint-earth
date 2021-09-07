import React, { useEffect } from "react"
import { Link } from "gatsby"
import Header from "../components/core/Header"
import { useState } from "react"
import { PieChart, Pie } from "recharts"

const BiggerPicture = () => {
  const data01 = [
    {
      name: "Group A",
      value: 400,
    },
    {
      name: "Group B",
      value: 300,
    },
    {
      name: "Group C",
      value: 300,
    },
    {
      name: "Group D",
      value: 200,
    },
    {
      name: "Group E",
      value: 278,
    },
    {
      name: "Group F",
      value: 189,
    },
  ]
  const data02 = [
    {
      name: "Group A",
      value: 2400,
    },
    {
      name: "Group B",
      value: 4567,
    },
    {
      name: "Group C",
      value: 1398,
    },
    {
      name: "Group D",
      value: 9800,
    },
    {
      name: "Group E",
      value: 3908,
    },
    {
      name: "Group F",
      value: 4800,
    },
  ]

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState()
  useEffect(async () => {
    const request = await fetch(`https://cdnhatch-api.onrender.com/stats`)
    const data = await request.json()
    setData(data)
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
          <p>Aggregating our audit data for a look at the wider web.</p>

          <div className="flex flex-col lg:flex-row">
            <div className="flex-grow">
              <h2 className="text-left font-bold text-2xl">
                Only X% of sites currently use Green Hosting Providers
              </h2>
              <p className="text-left">
                According to Digital Footprint usage statistics and data
                obtained via the{" "}
                <a href="https://www.thegreenwebfoundation.org/">
                  Green Web Foundation
                </a>
              </p>
            </div>
            <div className="flex-initial">
              This is where the pie chart should go
              <PieChart width={730} height={250}>
                <Pie
                  data={data01}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="#8884d8"
                />
                <Pie
                  data={data02}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                />
              </PieChart>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BiggerPicture
