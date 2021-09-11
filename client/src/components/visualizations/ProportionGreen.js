import * as React from "react"
import { PieChart, Pie, Cell } from "recharts"

{
  /* stats about proportion of sites that are green using recharts pie chart */
}
const ProportionGreen = ({ data }) => {
  const COLORS = ["#EF4444", "#0B9F6F"]

  const renderCustomizedLabel = ({
    index,
    cx,
    cy,
    midAngle,
    outerRadius,
    fill,
  }) => {
    const RADIAN = Math.PI / 180
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? "start" : "end"

    return (
      <>
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          fill="white"
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey + 5}
          textAnchor={textAnchor}
        >
          {`${
            environmentData[index].name === "green" ? "Green" : "Not Green"
          }: ${environmentData[index].value}`}
        </text>
      </>
    )
  }

  const environmentData = Object.keys(data.environment).map(key => ({
    name: key,
    value: data.environment[key],
  }))

  return (
    <div className="flex items-center justify-center flex-col lg:flex-row px-5">
      <div className="flex-grow">
        <h2 className="text-left font-bold text-2xl">
          Only{" "}
          <span className="underline">
            {(
              (data.environment.green * 100) /
              data.environment.notGreen
            ).toFixed(2)}
            %
          </span>
          of sites currently use Green Hosting Providers
        </h2>
        <p className="text-left">
          According to Digital Footprint usage statistics and data obtained via
          the{" "}
          <a href="https://www.thegreenwebfoundation.org/">
            Green Web Foundation
          </a>
        </p>
      </div>
      <div className="flex-initial">
        <div className="justify-center">
          <PieChart width={300} height={300}>
            <Pie
              stroke="none"
              data={environmentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              fill="#FBBF24"
              label={renderCustomizedLabel}
            >
              {environmentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
    </div>
  )
}

export default ProportionGreen
