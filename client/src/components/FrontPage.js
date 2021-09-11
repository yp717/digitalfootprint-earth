import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDoubleDownIcon, ArrowLeftIcon } from "@heroicons/react/solid"
import { redrawElements } from "../utils/AddElements"
import { Link as ScrollLink } from "react-scroll"
import useAnimationFrame from "../utils/useAnimationFrame"
import { useStory } from "../context/story-context"
import { useWindowSize } from "../utils/useWindowSize"
import Header from "./core/Header"
import SearchUI from "./SearchUI"

import LoadingProgressIndicator from "./LoadingProgressIndicator"

const ClientSideOnlyMap = React.lazy(() => import("./Map"))

const FrontPage = ({ children }) => {
  const isSSR = typeof window === "undefined"
  const {
    mapRef,
    webMapRef,
    ready,
    mapLoaded,
    setMapLoaded,
    rotate,
    reset,
    currentStoryItem,
    // validationError,
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
          currentStoryItem.serviceArea,
          hovered,
          setHovered
        )
      } else {
        mapRef.current.graphics.removeAll()
      }
    }
  }, [hovered, ready, currentStoryItem.points, currentStoryItem.lines, currentStoryItem.serviceArea, mapRef])

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
              className="absolute bottom-0 left-1/2 -ml-5 mb-10 z-50"
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
              webMapRef={webMapRef}
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
              className="absolute top-0 left-0 m-5 z-30"
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

        <SearchUI />
        <LoadingProgressIndicator />
      </motion.div>
      {children}
    </div>
  )
}

export default FrontPage
