import React from "react"
import { Link } from "gatsby"
import Header from "../components/core/Header"

const BiggerPicture = () => {
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center h-screen text-white ">
        <div className="flex flex-col text-center">
          <h1 className="font-bold text-6xl mb-6">The Bigger Picture</h1>
          <p>Aggregating our audit data for a look at the wider web.</p>
        </div>
      </div>
    </div>
  )
}

export default BiggerPicture
