import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import {
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
  ResponsiveContainer,
} from "recharts"

const dateFormatter = date => {
  return format(Date.parse(date), "dd/MM/yyyy")
}

const ScoreTimeline = ({ url }) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    const request = await fetch(
      `http://cdnhatch-api.onrender.com/timeline/${url}`
    )
    const data = await request.json()
    setData(data)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="h-8 w-full bg-gray-600" />
  }

  console.log(data)

  const processedData = data.timeline.map(item => {
    return {
      ...item.auditScores,
      date: item.date,
    }
  })

  console.log(processedData)
  // const timeStamp = data.timeline[0].date
  // console.log(timeStamp.toDateString())

  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-12">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart width={500} height={400} data={processedData}>
            <XAxis
              dataKey="date"
              dateFormatter={dateFormatter}
              tickFormatter={dateFormatter}
              domain={[
                Date.parse(processedData[0].date),
                Date.parse(processedData[processedData.length - 1].date),
              ]}
            />
            <YAxis dataKey="total" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#EF4444"
              fill="#EF4444"
            />
            <Line
              type="monotone"
              dataKey="hosting"
              stroke="#F59E0B"
              fill="#F59E0B"
            />
            <Line
              type="monotone"
              dataKey="pageWeight"
              stroke="#10B981"
              fill="#10B981"
            />
            <Line
              type="performance"
              dataKey="total"
              stroke="#3B82F6"
              fill="#3B82F6"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ScoreTimeline
