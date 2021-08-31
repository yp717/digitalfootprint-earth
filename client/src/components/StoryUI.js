import React, { useState } from "react"
import { useStory } from "../context/story-context"
import {
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/solid"
import { motion } from "framer-motion"

const StoryUI = () => {
  const { currentStoryItem, hasNext, hasPrev, next, prev, ready } = useStory()
  const [hidden, setHidden] = useState(false)
  if (!ready) {
    return null
  }
  const { hero, title, body } = currentStoryItem
  if (hero) {
    return (
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <div className="relative w-full h-full z-20">
          <div className="absolute top-0 left-0 flex flex-col space-y-5 h-full w-full items-center justify-center">
            <h2 className="text-8xl font-bold">{title}</h2>
            <p className="text-5xl">{body}</p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 mb-12 px-4 w-full z-30">
          <div className="w-full md:max-w-xl ml-auto">
            <motion.div
              className="flex flex-col w-full"
              initial={{ height: "auto", opacity: 1, y: 0 }}
              animate={
                hidden
                  ? { height: 100, opacity: 0, y: 100 }
                  : { height: "auto", opacity: 1, y: 0 }
              }
            >
              <div className="flex justify-end space-x-2">
                {hasPrev ? (
                  <button
                    onClick={prev}
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded py-1 px-2 flex items-center space-x-1"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                    <p className="font-bold">Previous</p>
                  </button>
                ) : (
                  <div />
                )}
                {hasNext ? (
                  <button
                    onClick={next}
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded py-1 px-2 flex items-center space-x-1"
                  >
                    <p className="font-bold">Next</p>
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="absolute bottom-0 right-0 mb-12 px-4 w-full z-30">
      <div className="w-full md:max-w-xl ml-auto">
        <motion.div
          className="flex justify-end"
          initial={{ y: 0 }}
          animate={hidden ? { y: 100 } : { y: 0 }}
        >
          <button
            onClick={() => setHidden(!hidden)}
            className={`${
              hidden ? "rounded py-2" : "rounded-t py-1"
            } bg-yellow-400 hover:bg-yellow-300 text-gray-900  px-2`}
          >
            {!hidden ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </motion.div>
        <motion.div
          className="flex flex-col w-full"
          initial={{ height: "auto", opacity: 1, y: 0 }}
          animate={
            hidden
              ? { height: 100, opacity: 0, y: 100 }
              : { height: "auto", opacity: 1, y: 0 }
          }
        >
          <div className="bg-space border-2 border-yellow-400 rounded-tl p-2 w-full h-full">
            <h2 className="text-xl font-bold">{title}</h2>
            <p>{body}</p>
          </div>
          <div className="flex justify-between">
            {hasPrev ? (
              <button
                onClick={prev}
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-b py-1 px-2 flex items-center space-x-1"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <p className="font-bold">Previous</p>
              </button>
            ) : (
              <div />
            )}
            {hasNext ? (
              <button
                onClick={next}
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-b py-1 px-2 flex items-center space-x-1"
              >
                <p className="font-bold">Next</p>
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StoryUI
