import React from "react"
import { useStory } from "../context/story-context"

const AuditUI = () => {
  const { currentStoryItem, auditScores } = useStory()
  const {
    showTotalScore,
    showPageWeightScore,
    showPerformanceScore,
    showHostingScore,
  } = currentStoryItem
  return (
    <div className="absolute top-0 right-0 mt-12 px-4 w-full md:max-w-lg z-20">
      <div className="grid grid-cols-1 gap-2 w-full md:max-w-lg ml-auto">
        <div className="bg-gray-800 rounded p-4 w-full h-full ">
          {showPageWeightScore && (
            <div className="flex justify-between items-center border-b-4 border-gray-700 pb-2 mb-2 text-3xl text-gray-100 font-bold">
              <p>Page Weight</p>
              <p>1/3</p>
            </div>
          )}
          {showPerformanceScore && (
            <div className="flex justify-between items-center border-b-4 border-gray-700 pb-2 mb-2 text-3xl text-gray-100 font-bold">
              <p>Performance</p>
              <p>3/3</p>
            </div>
          )}
          {showHostingScore && (
            <div className="flex justify-between items-center border-b-4 border-gray-700 pb-2 mb-2 text-3xl text-gray-100 font-bold">
              <p>Hosting</p>
              <p>3/3</p>
            </div>
          )}
          {showTotalScore && (
            <div className="flex justify-between items-center border-b-4 border-gray-700 pb-2 mb-2 text-3xl text-gray-100 font-bold">
              <p>Our score</p>
              <p>7/9</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuditUI
