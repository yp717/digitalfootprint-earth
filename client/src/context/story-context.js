import React, { useContext, useState, useRef, useEffect } from "react"
import StoryCreator from "../utils/StoryCreator"
import Ping from "ping.js"
import addLayers from "../utils/AddLayers"
export const isBrowser = () => typeof window !== "undefined"

const StoryContext = React.createContext()

export const StoryProvider = ({ ...props }) => {
  const [userInput, setUserInput] = useState("")

  const mapRef = useRef()
  const webMapRef = useRef()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [validationError, setValidationError] = useState(false)
  const [ready, setReady] = useState(false)
  const [rotate, setRotate] = useState(true)
  const [showTools, setShowTools] = useState(false)
  const [storyIndex, setStoryIndex] = useState(0)
  const [auditScores, setAuditScores] = useState({})
  const [storyItems, setStoryItems] = useState([
    {
      title: "StoryStub",
      body: "This is the content of my story block.",
      goTo: {
        target: [-3.0516, 52.7263],
        zoom: 1,
        duration: 2000,
      },
      rotate: false,
      layers: [],
      points: [],
    },
  ])

  async function validateURL(userInput) {
    // If the URL is not valid then return false
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ) // fragment locator

    // todo: we may not want to use a traditional alert it was just for testing
    if (await !pattern.test(userInput)) {
      setValidationError(true)
      return false
    }

    setValidationError(false)
    // Remove the protocol if there is one
    let result = userInput.replace(/(^\w+:|^)\/\//, "")

    // Remove any trailing paths if there are any
    result = result.split("/")[0]

    return result
  }

  const submitURL = async userInput => {
    const p = new Ping()
    let time = -1
    try {
      const req = await p.ping(`https://${userInput}`)
      time = req
    } catch (e) {
      time = e
    }

    const validatedURL = await validateURL(userInput)

    if (!validationError && validatedURL !== false) {
      setSubmitted(true)
      const request = await fetch(
        `https://cdnhatch-api.onrender.com/story/${validatedURL}`
      )
      const data = await request.json()
      data.requestData.networkLatency = time
      let story = StoryCreator(data)
      setStoryItems([...story])
      setAuditScores(data.auditScores)
      setReady(true)
    }
  }

  useEffect(() => {
    if (ready && showTools) {
      document.body.classList.remove("tools-hidden")
    } else {
      document.body.classList.add("tools-hidden")
      
    }
  }, [ready, showTools])

  useEffect(() => {
    if (ready) {
      document.body.classList.add("noscroll")
    } else {
      document.body.classList.remove("noscroll")
    }
  }, [ready])

  useEffect(() => {
    if (ready) {
      setRotate(false)
      setTimeout(() => {
        webMapRef.current.layers.removeAll()
        if (storyItems[storyIndex].goTo) {
          const { target, zoom, duration } = storyItems[storyIndex].goTo
          mapRef.current.goTo(
            {
              target: target,
              zoom: zoom,
            },
            { animate: true, duration: duration }
          )
          if (storyItems[storyIndex].rotate === true) {
            setTimeout(() => {
              setRotate(true)
            }, duration)
          }
        } else {
          if (storyItems[storyIndex].rotate === true) {
            setRotate(true)
          }
        }

        if (
          storyItems[storyIndex].layers &&
          storyItems[storyIndex].layers.length !== 0
        ) {
          addLayers(webMapRef, storyItems[storyIndex].layers)
        }
      }, 200)
    }
  }, [ready, storyIndex, storyItems])

  const next = () => {
    setStoryIndex(Math.min(storyIndex + 1, storyItems.length - 1))
  }
  const prev = () => {
    setStoryIndex(Math.max(storyIndex - 1, 0))
  }
  const hasNext = storyIndex + 1 <= storyItems.length - 1
  const hasPrev = storyIndex - 1 >= 0

  const reset = () => {
    setRotate(false)
    mapRef.current.goTo(
      {
        target: [-93.94, 29.89],
        zoom: 0,
      },
      { animate: true, duration: 1500 }
    )
    setTimeout(() => {
      webMapRef.current.layers.removeAll()
      setSubmitted(false)
      setReady(false)
      setStoryIndex(0)
      setRotate(true)
    }, 1500)
  }
  return (
    <StoryContext.Provider
      value={{
        userInput,
        setUserInput,
        toggleTools: () => setShowTools(!showTools),
        mapRef,
        webMapRef,
        mapLoaded,
        setMapLoaded,
        submitted,
        ready,
        currentStoryItem: storyItems[storyIndex],
        auditScores,
        next,
        prev,
        hasNext,
        hasPrev,
        submitURL,
        validationError,
        setValidationError,
        rotate,
        reset,
      }}
      {...props}
    />
  )
}

export const useStory = () => useContext(StoryContext)

export default StoryContext
