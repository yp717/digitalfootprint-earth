import React from "react"
import { Link } from "gatsby"
import FrontPage from "../components/FrontPage"
import StoryUI from "../components/StoryUI"
import { StoryProvider } from "../context/story-context"
import Seo from "../components/core/SEO"
import Footer from "../components/core/Footer"

const Index = () => {
  return (
    <StoryProvider>
      <div>
        <FrontPage>
          <Seo title="Home" description="DigitalFootprint.earth" />
          <StoryUI />
          <div
            id="research"
            className="h-screen w-screen flex flex-col items-center justify-between p-12"
          >
            <ul className="space-y-6 text-2xl text-center pt-24">
              {/* <li className="px-2 py-1 rounded-full">
                <Link to="/how-it-works">How It Works</Link>
              </li> */}
              <li className="px-2 py-1 rounded-full">
                <Link to="/bigger-picture">The Bigger Picture</Link>
              </li>
              <li className="px-2 py-1 rounded-full">
                <Link to="/api">API Access</Link>
              </li>
            </ul>
            <Footer/>
          </div>
        </FrontPage>
      </div>
    </StoryProvider>
  )
}

export default Index
