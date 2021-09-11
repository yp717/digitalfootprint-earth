import React, { useEffect, useState } from "react"
import { LineChart, Line, ResponsiveContainer } from "recharts";

const data = [
    {
      name: "Page A",
      pv: 2400,
    },
    {
      name: "Page B",
      pv: 1398,
    },
    {
      name: "Page C",
      pv: 9800,
    },
    {
      name: "Page D",
      pv: 3908,
    },
    {
      name: "Page E",
      pv: 4800,
    },
    {
      name: "Page F",
      pv: 3800,
    },
    {
      name: "Page G",
      pv: 4300,
    },
  ];

const ScoreTimeline = ({url}) => {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(async () => {
        const request = await fetch(
            `http://localhost:3000/timeline/${url}`
          )
          const data = await request.json()
          setData(data)
          setLoading(false)
    }, [])
    if(loading){
        return <div className="h-8 w-full  bg-gray-600"/>
    } else{
        console.log(data)
        return (
            <div className="bg-gray-600 h-64 w-full">
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <Line
                    type="monotone"
                    dataKey="pv"
                    strokeWidth={3}
                    dot={false}
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
   
}

export default ScoreTimeline