import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts"

import database from "../../../../scripts/database.json"

const compactNumber = value => {
  console.log(value)
  const suffixes = ["", "k", "m", "b", "t"]

  const suffixNum = Math.floor(("" + value).length / 3)

  let shortValue = parseFloat(
    (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2)
  )

  if (shortValue % 1 != 0) {
    shortValue = shortValue.toFixed(1)
  }

  return shortValue + suffixes[suffixNum]
}

// Plot a horizontal line where the average CO2 produced is for each of the websites
const PopularSitesOverview = () => {
  return (
    <div className="w-full px-5">
      <h3 className="font-bold text-3xl text-center lg:text-left w-full mb-4">
        This is a problem even for some of the worlds biggest sites.
      </h3>
      <p className="text-center lg:text-left w-full">
        Many of the world's most popular sites have an above average carbon
        footprint. With billions of users and visits each year, their combined
        impact alone produces NUMBER tonnes of CO2 each year.
      </p>
      <div className="grid grid-cols-12 mt-6">
        <div className="col-span-12">
          <ResponsiveContainer width={"100%"} height={300}>
            <BarChart
              width={500}
              height={300}
              data={database.slice(0, 10)}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis tick={{ fill: "white" }} dataKey="position" />
              <YAxis tick={{ fill: "white" }} tickFormatter={compactNumber} />
              <Legend
                payload={[
                  {
                    id: "count",
                    value: "Unique Page Visitors",
                    type: "square",
                    color: "#8884d8",
                  },
                  {
                    id: "etv",
                    value: "Estimated Traffic",
                    type: "square",
                    color: "#82ca9d",
                  },
                ]}
                height={40}
              />
              <Bar dataKey="count" fill="#10B981">
                <LabelList
                  dataKey="domain"
                  position="insideLeft"
                  angle="-90"
                  stroke="white"
                  fill="white"
                  offset={12}
                />
              </Bar>
              <Bar dataKey="etv" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default PopularSitesOverview
