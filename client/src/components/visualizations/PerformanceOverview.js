import * as React from "react"

/* todo: have to add units here :) */
const PerformanceOverview = ({ data }) => {
  return (
    <div className="grid grid-cols-12 space-x-4">
      <div className="col-span-12">
        <h3 className="font-bold text-3xl text-left w-full mb-4">
          Performance Statistics
        </h3>
        <p className="text-left w-full">
          As users continue to visit DigitalFootprint.earth, we continue to
          collect and aggregate performance statistics to form a benchmark and
          standard for websites. We hope that this standard shows some of our
          users how well or poorly they are performing against their peers.
        </p>
      </div>
      <div className="h-32 text-black col-span-12 lg:col-span-4 bg-yellow-400 rounded-lg my-4 py-8">
        <p className="font-medium">Average Performance</p>
        <h4 className="font-extrabold text-4xl">
          {data.performance.averagePerf.toFixed(2)}
        </h4>
      </div>
      <div className="h-32 text-black col-span-12 lg:col-span-4 bg-yellow-400 rounded-lg my-4 py-8">
        <p className="font-medium">Cumulative Performance</p>
        <h4 className="font-extrabold text-4xl">
          {data.performance.cumulitivePerf.toFixed(2)}
        </h4>
      </div>
      <div className="h-32 text-black col-span-12 lg:col-span-4 bg-yellow-400 rounded-lg my-4 py-8">
        <p className="font-medium">Sites Audited</p>
        <h4 className="font-extrabold text-4xl">
          {data.performance.perfCount}
        </h4>
      </div>
    </div>
  )
}

export default PerformanceOverview
