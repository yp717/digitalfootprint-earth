import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  LabelList,
  Label,
} from "recharts"

import top10 from "../../assets/top10.json"

const compactNumber = value => {
  const suffixes = ["", "k", "m", "b", "t"]
  const suffixNum = Math.floor(("" + value).length / 3)

  let shortValue = parseFloat(
    (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2)
  )

  if (shortValue % 1 !== 0) {
    shortValue = shortValue.toFixed(1)
  }

  return shortValue + suffixes[suffixNum]
}

const numberWithCommas = number => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Plot a horizontal line where the average CO2 produced is for each of the websites
const PopularSitesOverview = () => {
  // assumimg 10 g/MB based on https://www.earth.org.uk/note-on-carbon-cost-of-CDN.html
  const processedTop10 = top10.map(item => {
    return { ...item, size: (item.size * 10) / 1024 / 1024 }
  })

  let CO2_tonnes = processedTop10.reduce((acc, curr) => {
    acc += curr.size * curr.etv
    return acc
  }, 0)

  // convert to tonnes
  CO2_tonnes = CO2_tonnes / 1000 / 1000

  console.log(processedTop10)

  return (
    <div className="w-full px-5">
      <h3 className="font-bold text-3xl text-center lg:text-left w-full mb-4">
        This is a problem even for some of the worlds biggest sites.
      </h3>
      <p className="text-center lg:text-left w-full">
        Many of the world's most popular sites have an above average carbon
        footprint. With billions of users and visits each year, their combined
        impact alone produces {numberWithCommas(CO2_tonnes.toFixed(2))} tonnes
        of CO2 each year.
      </p>
      <div className="grid grid-cols-12 mt-6">
        <div className="col-span-12">
          <ResponsiveContainer width={"100%"} height={300}>
            <BarChart width={500} height={300} data={processedTop10}>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis tick={{ fill: "white" }} dataKey="position" />
              <YAxis
                tick={{ fill: "white" }}
                tickFormatter={compactNumber}
                yAxisId="left"
              >
                <Label
                  value="Est. CO2 per visit"
                  position="insideLeft"
                  angle={-90}
                  dy={-10}
                  fill="white"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <YAxis
                tick={{ fill: "white" }}
                tickFormatter={compactNumber}
                yAxisId="right"
                orientation="right"
              >
                <Label
                  value="Estimated Traffic"
                  position="insideLeft"
                  angle={-90}
                  dx={50}
                  fill="white"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Legend
                payload={[
                  {
                    id: "size",
                    value: "Est. CO2 per visit",
                    type: "square",
                    color: "#10B981",
                  },
                  {
                    id: "etv",
                    value: "Estimated Traffic",
                    type: "square",
                    color: "#3B82F6",
                  },
                ]}
                height={40}
              />
              <Bar dataKey="size" fill="#10B981" yAxisId="left">
                <LabelList
                  dataKey="domain"
                  position="insideLeft"
                  angle="-90"
                  stroke="white"
                  fill="white"
                  // offset={12}
                />
              </Bar>
              <Bar dataKey="etv" fill="#3B82F6" yAxisId="right" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default PopularSitesOverview
