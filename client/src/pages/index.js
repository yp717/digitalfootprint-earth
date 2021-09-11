import React from "react"
import { Link } from "gatsby"
import FrontPage from "../components/FrontPage"
import StoryUI from "../components/StoryUI"
import { StoryProvider } from "../context/story-context"
import SEO from "../components/core/SEO"

const Index = () => {
  return (
    <StoryProvider>
      <FrontPage>
        <SEO title="Home" description="DigitalFootprint.earth" />
        <StoryUI />
        <div
          id="research"
          className="h-screen w-screen flex flex-col items-center justify-center p-12"
        >
          <ul className="space-y-6 text-2xl text-center">
            <li className="px-2 py-1 rounded-full">
              <Link to="/how-it-works">How It Works</Link>
            </li>
            <li className="px-2 py-1 rounded-full">
              <Link to="/bigger-picture">The Bigger Picture</Link>
            </li>
            <li className="px-2 py-1 rounded-full">
              <Link to="/api">API Access</Link>
            </li>
          </ul>
          <div></div>
        </div>
      </FrontPage>
    </StoryProvider>
  )
}

export default Index
