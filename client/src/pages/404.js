import React from "react"
import { Link } from "gatsby"
import Header from "../components/core/Header"
import Seo from "../components/core/SEO"

const FourOhFour = () => {
  return (
    <div>
      <Seo title="404" description="Page not found." />
      <Header />
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col text-center">
          <h1 className="text-white font-bold text-6xl mb-6">
            Oops! I think we got lost :(
          </h1>
          <div>
            <Link to="/" className="text-2xl min-w-min">
              Take me home!
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FourOhFour
