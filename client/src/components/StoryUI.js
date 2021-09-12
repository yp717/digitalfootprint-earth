import React, { useState } from "react"
import { useStory } from "../context/story-context"
import {
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/solid"
import { CheckCircleIcon as CheckCircleOutline } from "@heroicons/react/outline"
import { motion } from "framer-motion"
import AuditUI from "./AuditUI"
import Overlay from "./Overlay"
import { Link } from "gatsby"
import ActGreener from "./ActGreener"

const StoryUI = () => {
  const {
    currentStoryItem,
    hasNext,
    hasPrev,
    next,
    prev,
    ready,
    storyEnd,
    setStoryEnd,
    tempURL,
    auditScores,
  } = useStory()
  const [hidden, setHidden] = useState(false)
  if (!ready) {
    return null
  }
  if (storyEnd) {
    const { hosting, pageWeight, performance, total } = auditScores
    return (
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <div className="relative w-full h-full z-20">
          <div className="absolute top-0 left-0 flex flex-col space-y-5 h-full w-full items-center justify-center">
            <div className="flex items-center space-x-2">
              <CheckCircleOutline className="w-8" />
              <h2 className="text-3xl font-bold">Story Complete</h2>
            </div>
            <div className="w-full max-w-3xl flex flex-col space-y-5">
              <div className="flex flex-col bg-space border-yellow-400 text-yellow-400 border-2 rounded p-4 w-full h-full text-lg md:text-xl font-bold">
                <ul>
                  <li className="flex">
                    <p className="flex-grow">Performance</p>
                    <p className="flex-initial">{performance}/3</p>
                  </li>
                  <li className="flex">
                    <p className="flex-grow">Page Size</p>
                    <p className="flex-initial">{pageWeight}/3</p>
                  </li>
                  <li className="flex">
                    <p className="flex-grow">Hosting</p>
                    <p className="flex-initial">{hosting}/3</p>
                  </li>
                  <li>
                    <div className="w-full h-1 border-b border-yellow-400 my-2"></div>
                  </li>
                  <li className="flex">
                    <p className="flex-grow font-bold text-3xl">Total Score</p>
                    <p className="flex-initial font-bold text-3xl">{total}/9</p>
                  </li>
                </ul>
              </div>

              <ActGreener />

              <div className="grid grid-cols-2 gap-4 text-gray-900">
                <button
                  onClick={() => setStoryEnd(false)}
                  className="bg-yellow-400 hover:bg-yellow-300 rounded py-2 px-2 flex items-center space-x-2 text-center align-center"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-gray-900" />
                  <p className="text-gray-900 font-semibold">Return To Story</p>
                </button>
                <Link
                  to={`/audit/${tempURL}`}
                  className="bg-yellow-400 hover:bg-yellow-300 rounded py-2 px-2 flex items-center space-x-2 text-center w-full"
                >
                  <ChartBarIcon className="h-5 w-5 text-gray-900" />
                  <p className="text-gray-900 font-semibold">
                    View Audit Results
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const { hero, title, body, small } = currentStoryItem
  if (hero) {
    return (
      <>
        <Overlay />
        <AuditUI />
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <div className="relative w-full h-full z-20">
            <div className="absolute top-0 left-0 flex flex-col space-y-5 h-full w-full items-center justify-center p-4">
              {small ? (
                <div className="bg-space border-2 border-yellow-400 p-5 rounded max-w-4xl ">
                  <h2 className="text-3xl md:text-5xl font-bold text-center">
                    {title}
                  </h2>
                  <div className="mx-2 w-full h-1 border-b border-gray-800 my-2" />
                  <p className="text-base md:text-2xl text-center">{body}</p>
                </div>
              ) : (
                <>
                  <h2 className="text-4xl md:text-8xl font-bold text-center">
                    {title}
                  </h2>
                  <p className="text-lg md:text-5xl text-center">{body}</p>{" "}
                </>
              )}
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
                    <button
                      onClick={next}
                      className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-b py-1 px-2 flex items-center space-x-1"
                    >
                      <p className="font-bold">Finish</p>
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <Overlay />
      <AuditUI />
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
                <button
                  onClick={next}
                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-b py-1 px-2 flex items-center space-x-1"
                >
                  <p className="font-bold">Finish</p>
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default StoryUI
