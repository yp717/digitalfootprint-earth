import React from "react"
import { Link } from "gatsby"

import Logo from "../../assets/Logo"
import DevPost from "../../assets/Devpost"
import GitHub from "../../assets/Github"

const Header = () => {
  return (
    <div className="absolute top-0 left-0 w-full flex flex-col md:flex-row md:justify-between py-3 md:py-5 px-5 md:px-10 z-50">
      <div className="">
        <div className="flex items-center space-x-1">
          <Link
            to="/"
            className="flex items-center space-x-1 text-white hover:text-yellow-400"
          >
            <Logo className="h-6 w-6 mb-1" />
            <p className="text-xl text-white">
              <span className="font-bold">Digital</span>Footprint
            </p>
          </Link>
        </div>
      </div>
      <div className="hidden md:inline-block text-right text-xs md:text-sm">
        <p className="text-white">
          A submission for{" "}
          <a href="https://hack-for-a-sustainable-future.devpost.com">
            Esri's Hack for a Sustainable Future
          </a>
        </p>
        <p className="text-white">
          Built by{" "}
          <a className="" href="https://sld.codes">
            Sam Larsen-Disney
          </a>{" "}
          & <a href="https://yannispanagis.com">Yannis Panagis</a>
        </p>
        <div className="mt-2 hidden md:flex space-x-2 items-center md:justify-end">
        <GitHub className="w-6" />
          <a
            href="https://hack-for-a-sustainable-future.devpost.com"
            className=""
          >
            <DevPost className="w-20 md:w-24" />
          </a>
          
   
     
        </div>
      </div>
    </div>
  )
}

export default Header
