import React, { useContext, useState, useRef, useEffect } from "react"
export const isBrowser = () => typeof window !== "undefined"

const StoryContext = React.createContext()

export const StoryProvider = ({ ...props }) => {
  const mapRef = useRef()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ready, setReady] = useState(false)
  const [rotate, setRotate] = useState(true)
  const [storyIndex, setStoryIndex] = useState(0)
  const [storyItems, setStoryItems] = useState([
    {
      title: "My First Section",
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
    {
      title: "My Second Section",
      body: "This is the content of my story block.",
      goTo: {
        target: [3.0516, 64.7263],
        zoom: 1,
        duration: 2000,
      },
      rotate: true,
      layers: [],
      points: [],
    },
  ])

  const submitURL = async userInput => {
    setSubmitted(true)
    const request = await fetch(`http://localhost:3000/${userInput}`)
    const data = await request.json()
    // setRequestOrigin({ latitude: data.userInfo.lat, longitude: data.userInfo.lon })
    // if (data.cdnInfo.cdnLocations) {
    //   setPoints(
    //     data.cdnInfo.cdnLocations.map(({ lat, lon, ...otherProps }) => ({
    //       latitude: lat,
    //       longitude: lon,
    //       ...otherProps
    //     }))
    //   )
    // }
    setReady(true)
  }

  useEffect(() => {
    if (ready) {
      document.body.classList.add("noscroll")
    } else {
      document.body.classList.remove("noscroll")
    }
  }, [ready])

  useEffect(() => {
    console.log(ready, storyIndex)
    if (ready) {
      if (storyItems[storyIndex].rotate === true) {
        setRotate(true)
      } else {
        setRotate(false)
        setTimeout(() => {
          const { target, zoom, duration } = storyItems[storyIndex].goTo
          mapRef.current.goTo(
            {
              target: target,
              zoom: zoom,
            },
            { animate: true, duration: duration }
          )
        }, 200)
      }
    }
  }, [ready, storyIndex])

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
      setSubmitted(false)
      setReady(false)
      setStoryIndex(0)
      setRotate(true)
    }, 1500)
  }
  return (
    <StoryContext.Provider
      value={{
        mapRef,
        mapLoaded,
        setMapLoaded,
        submitted,
        ready,
        currentStoryItem: storyItems[storyIndex],
        next,
        prev,
        hasNext,
        hasPrev,
        submitURL,
        rotate,
        reset,
      }}
      {...props}
    />
  )
}

export const useStory = () => useContext(StoryContext)

export default StoryContext
