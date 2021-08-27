import React, { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  SearchIcon,
  ChevronDoubleDownIcon,
  ArrowLeftIcon,
} from "@heroicons/react/solid"
import { redrawElements } from "../utils/AddElements"
import Logo from "../assets/Logo"
import { Link as ScrollLink } from "react-scroll"
import DevPost from "../assets/Devpost"
import useAnimationFrame from "../utils/useAnimationFrame"

const ClientSideOnlyMap = React.lazy(() => import("./Map"))

const variants = {
  idle: { padding: "6rem" },
  active: { padding: " 0rem" },
}

const FrontPage = ({ children }) => {
  const isSSR = typeof window === "undefined"
  const mapRef = useRef()
  const [hovered, setHovered] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [points, setPoints] = useState([])
  const [requestOrigin, setRequestOrigin] = useState({
    latitude: 0,
    longitude: 0,
  })
  useEffect(() => {
    if (submitted) {
      document.body.classList.add("noscroll")
      mapRef.current.goTo(
        {
          target: [requestOrigin.longitude, requestOrigin.latitude],
          zoom: 3,
        },
        { animate: true, duration: 4000 }
      )
    } else {
      document.body.classList.remove("noscroll")
    }
  }, [submitted])

  useEffect(() => {
    const timerId = setInterval(() => {}, 1000)
    return () => clearInterval(timerId)
  }, [mapRef.current])

  useAnimationFrame(() => {
    if (mapRef.current && mapRef.current.camera) {
      if (!submitted) {
        const camera = mapRef.current.camera.clone()
        camera.position.longitude -= 0.1
        mapRef.current.goTo(camera, { animate: false })
      }
    }
  }, [submitted, mapRef.current])

  useEffect(() => {
    if (mapRef.current) {
      if (submitted) {
        redrawElements(mapRef, requestOrigin, points, hovered, setHovered)
      } else {
        mapRef.current.graphics.removeAll()
      }
    }
  }, [hovered, submitted])

  const submit = async () => {
    const request = await fetch(`http://localhost:3000/${userInput}`)
    const data = await request.json()
    setRequestOrigin({ latitude: data.lat, longitude: data.lon })
    if (data.CDN_LOCATIONS) {
      setPoints(
        data.CDN_LOCATIONS.map(({ lat, lon }) => ({
          latitude: lat,
          longitude: lon,
        }))
      )
    }
    setSubmitted(true)
  }

  return (
    <div className={`text-white scroll ${submitted ? "noscroll" : ""}`}>
      <motion.div
        initial="idle"
        animate={submitted ? "active" : "idle"}
        variants={variants}
        transition={{ duration: 1 }}
        className={`h-screen w-screen relative`}
      >
        {!isSSR && (
          <React.Suspense fallback={<div />}>
            <ClientSideOnlyMap
              mapRef={mapRef}
              setIsLoaded={setIsLoaded}
              setHovered={setHovered}
            />
          </React.Suspense>
        )}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              key="smooth-load"
              id="smooth-load"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="bg-space absolute top-0 left-0 w-full h-full"
            />
          )}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 m-5"
            >
              <button
                onClick={() => {
                  mapRef.current.goTo(
                    {
                      target: [-93.94, 29.89],
                      zoom: 0,
                    },
                    { animate: true, duration: 1000 }
                  )
                  setTimeout(() => {
                    setSubmitted(false)
                    setPoints([])
                    setRequestOrigin({
                      latitude: 0,
                      longitude: 0,
                    })
                  }, 1000)
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

        {!submitted && (
          <>
            <div className="absolute z-30 h-full w-full top-0 left-0">
              <div className="flex flex-col items-center justify-center w-full h-full space-y-3">
                <Logo className="h-12 w-12 text-yellow-400" />
                <h1 className="text-4xl font-bold text-white max-w-lg text-center">
                  Optimizing CDN locations for a greener planet.
                </h1>
                <div className="border-4 border-yellow-400 rounded-full flex p-1 w-full max-w-lg">
                  <input
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    placeholder="your-website.com"
                    className="w-full bg-transparent text-2xl text-white px-2 mx-2 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      submit()
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 rounded-full text-white p-2"
                  >
                    <SearchIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
            <ScrollLink
              to="research"
              smooth={true}
              duration={500}
              className="absolute bottom-0 left-1/2 -ml-5 mb-10 z-30"
            >
              <ChevronDoubleDownIcon className="h-10 w-10" />
            </ScrollLink>
            <div className="absolute top-0 left-0 text-right my-5 mx-10 z-30">
              <div className="flex items-center space-x-1">
                <Logo className="h-6 w-6 mb-1" />
                <p className="text-xl">
                  <span className="font-bold">CDN</span>Hatch
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 text-right my-5 mx-10 z-30">
              <p className="text-sm">
                A submission for <a>Esri's Hack for a Sustainable Future</a>
              </p>
              <p className="text-sm">
                Built by <a>Sam Larsen-Disney</a> & <a>Yannis Panagis</a>
              </p>
              <div className="flex mt-2 justify-end">
                <a href="" className="">
                  <DevPost className="w-24" />
                </a>
              </div>
            </div>
          </>
        )}
      </motion.div>
      {children}
    </div>
  )
}

export default FrontPage
