import React, { useState } from "react"
import { useStory } from "../context/story-context"
import {
  CogIcon,
  HandIcon,
  XCircleIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid"
const AuditUI = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  // can also pull out auditScores from the story
  const { currentStoryItem, toggleTools } = useStory()
  const {
    showTotalScore,
    showPageWeightScore,
    showPerformanceScore,
    showHostingScore,
  } = currentStoryItem
  const shouldShow = [
    showTotalScore,
    showPageWeightScore,
    showPerformanceScore,
    showHostingScore,
  ].some(val => val)
  return (
    <div className="absolute top-0 right-0 pt-4 px-2 w-full md:max-w-md z-20">
      <div className="w-full ml-auto flex flex-col items-end justify-center mb-4 text-black">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-yellow-400 p-1 rounded-full"
        >
          {!menuOpen ? (
            <CogIcon className="h-6 w-6" />
          ) : (
            <XCircleIcon className="h-6 w-6" />
          )}
        </button>
        {menuOpen && (
          <div className="space-y-1 mt-1">
            <button
              onClick={toggleTools}
              className="flex space-x-1 items-center bg-yellow-400 p-1 rounded"
            >
              <HandIcon className="h-6 w-6" />
              <p>Toggle Map Tools</p>
            </button>
          </div>
        )}
      </div>
      {shouldShow && (
        <div className="grid grid-cols-1 gap-2 w-full ml-auto">
          <div className="bg-gray-800 rounded p-4 w-full h-full space-y-2">
            {showHostingScore && (
              <div className="flex justify-between items-center text-xl text-gray-100 font-bold">
                <p>Hosting</p>
                <p>{showHostingScore}/3</p>
              </div>
            )}
            {showPerformanceScore && (
              <div className="flex justify-between items-center text-xl text-gray-100 font-bold">
                <p>Performance</p>
                <p>{showPerformanceScore}/3</p>
              </div>
            )}
            {showPageWeightScore && (
              <div className="flex justify-between items-center text-xl text-gray-100 font-bold">
                <p>Page Weight</p>
                <p>{showPageWeightScore}/3</p>
              </div>
            )}
            {showTotalScore && (
              <div className="flex justify-between items-center border-t-4 border-gray-700 pt-2 mb-2 text-xl text-gray-100 font-bold">
                <p>Our score</p>
                <p>{showTotalScore}/9</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditUI
