import React from "react"
import { useEffect } from "react"
import FrontPage from "../components/FrontPage"
import StoryUI from "../components/StoryUI"
import { StoryProvider } from "../context/story-context"

const Index = () => {
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
