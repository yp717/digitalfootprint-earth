import React from "react"
import { useEffect } from "react"
import FrontPage from "../components/FrontPage"
import StoryUI from "../components/StoryUI"
import { StoryProvider } from "../context/story-context"
import Ping from "ping.js"

const Index = () => {
  useEffect(async () => {
    var p = new Ping()
    let time = -1
    try {
      const req = await p.ping("http://linkedin.com")
      time = req
    } catch (e) {
      time = e
    }
    console.log(time)
  }, [])
  return (
    <StoryProvider>
      <FrontPage>
        <StoryUI />
        <div
          id="research"
          className="h-screen w-screen flex flex-col items-center justify-center"
        >
          <p className="text-2xl font-medium">Our Research</p>
        </div>
      </FrontPage>
    </StoryProvider>
  )
}

export default Index
