import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts"

const dateFormatter = date => {
  return format(new Date(date), "dd/MMM")
}

const ScoreTimeline = ({ url }) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    // todo: change this to the real API when its pushed
    const request = await fetch(`http://localhost:3000/timeline/${url}`)
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

  const timeStamp = data.timeline[0].date
  console.log(new Date(timeStamp).toDateString())

  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-12">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart width={500} height={400} data={processedData}>
            <XAxis dataKey="date" scale="time" tickFormatter={dateFormatter} />
            <YAxis dataKey="total" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ScoreTimeline
