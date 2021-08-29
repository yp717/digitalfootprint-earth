import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  SearchIcon,
  ChevronDoubleDownIcon,
  ArrowLeftIcon,
} from "@heroicons/react/solid"
import { redrawElements } from "../utils/AddElements"
import Logo from "../assets/Logo"
import { Link as ScrollLink } from "react-scroll"
import useAnimationFrame from "../utils/useAnimationFrame"
import { useStory } from "../context/story-context"
import { useWindowSize } from "../utils/useWindowSize"
import Header from "./core/Header"
import SearchBar from "./SearchBar"

const ClientSideOnlyMap = React.lazy(() => import("./Map"))

const FrontPage = ({ children }) => {
  const isSSR = typeof window === "undefined"
  const {
    mapRef,
    ready,
    mapLoaded,
    setMapLoaded,
    rotate,
    reset,
    currentStoryItem,
    submitted,
    validationError,
  } = useStory()
  const [hovered, setHovered] = useState("")

  const { width } = useWindowSize()
  const variants = {
    idle: { padding: width < 550 ? "2rem" : width < 1000 ? "4rem" : "6rem" },
    active: { padding: " 0rem" },
  }

  useAnimationFrame(() => {
    if (mapRef.current && mapRef.current.camera) {
      if (rotate) {
        const camera = mapRef.current.camera.clone()
        camera.position.longitude -= 0.1
        mapRef.current.goTo(camera, { animate: false })
      }
    }
  }, [mapRef.current])

  useEffect(() => {
    if (mapRef.current) {
      if (ready) {
        redrawElements(
          mapRef,
          currentStoryItem.points,
          currentStoryItem.lines,
          hovered,
          setHovered
        )
      } else {
        mapRef.current.graphics.removeAll()
      }
    }
  }, [hovered, ready, currentStoryItem.points, currentStoryItem.lines, mapRef])

  console.log(validationError)

  return (
    <div className={`text-white scroll`}>
      <motion.div
        initial="idle"
        animate={ready ? "active" : "idle"}
        variants={variants}
        transition={{ duration: 1 }}
        className={`h-screen w-screen relative`}
      >
        {!ready && (
          <>
            <ScrollLink
              to="research"
              smooth={true}
              duration={500}
              className="absolute bottom-0 left-1/2 -ml-5 mb-10 z-30"
            >
              <ChevronDoubleDownIcon className="h-10 w-10" />
            </ScrollLink>
            <Header />
          </>
        )}
        {!isSSR && (
          <React.Suspense fallback={<div />}>
            <ClientSideOnlyMap
              mapRef={mapRef}
              setIsLoaded={setMapLoaded}
              setHovered={setHovered}
            />
          </React.Suspense>
        )}
        <AnimatePresence>
          {!mapLoaded && (
            <motion.div
              key="smooth-load"
              id="smooth-load"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="bg-space absolute top-0 left-0 w-full h-full z-10"
            />
          )}
          {ready ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 m-5"
            >
              <button
                onClick={() => {
                  reset()
                }}
              >
                <ArrowLeftIcon className="h-8 w-8" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="overlay"
              id="overlay"
              initial={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="bg-black absolute top-0 left-0 w-full h-full z-20"
            />
          )}
        </AnimatePresence>

        {mapLoaded && !submitted && !ready && (
          <>
            <div className="absolute z-30 h-full w-full top-0 left-0 px-2">
              <div className="flex flex-col items-center justify-center w-full h-full space-y-3">
                <Logo className="h-8 w-8 md:h-12 md:w-12 text-yellow-400" />
                <h1 className="text-2xl md:text-4xl font-bold text-white max-w-lg text-center">
                  Optimizing CDN locations for a greener planet.
                </h1>
                <SearchBar />
              </div>
            </div>
          </>
        )}

        {(!mapLoaded || (submitted && !ready)) && (
          <div className="absolute z-30 h-full w-full top-0 left-0">
            <div className="flex flex-col items-center justify-center w-full h-full space-y-3">
              <svg
                className="animate-spin -ml-1 mr-3 h-16 w-16 md:h-24 md:w-24 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-lg md:text-2xl font-bold">
                {!mapLoaded
                  ? "Preparing your experience..."
                  : "Creating the story..."}
              </p>
            </div>
          </div>
        )}
      </motion.div>
      {children}
    </div>
  )
}

export default FrontPage
