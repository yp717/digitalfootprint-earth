import React from "react"
import FrontPage from "../components/FrontPage"
import StoryUI from "../components/StoryUI"
import { StoryProvider } from "../context/story-context"

const Index = () => {
  return (
    <StoryProvider>
      <FrontPage>
        <StoryUI />
        <div id="research" className="h-screen w-screen flex p-12 space-x-6">
          <ul className="space-y-3 text-center">
            <li className="bg-gray-900 px-2 py-1 rounded-full">About</li>
            <li className="bg-gray-900 px-2 py-1 rounded-full">Our Research</li>
          </ul>
          <div>
          <p className="text-6xl text-yellow-400 font-bold">Our Research</p>
          </div>
        </div>
      </FrontPage>
    </StoryProvider>
  )
}

export default Index
