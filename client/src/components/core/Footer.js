import React from "react"
import DevPost from "../../assets/Devpost"
import GitHub from "../../assets/Github"
import Logo from "../../assets/Logo"

const Footer = () => (
  <footer className="text-center space-y-4 flex flex-col items-center">
    <p>
      Built by{" "}
      <a className="" href="https://sld.codes">
        Sam Larsen-Disney
      </a>{" "}
      & <a href="https://yannispanagis.com">Yannis Panagis</a>
    </p>
    <div className="w-full flex items-center justify-center space-x-2">
      <GitHub className="w-6" />
      <DevPost className="w-24" />
    </div>
    <div>
      <div className="flex items-center justify-center space-x-4 text-gray-600 mt-12 ">
        <Logo className="w-6 " />
        <p className="my-0">digitalfootprint.earth</p>
      </div>
    </div>
  </footer>
)

export default Footer
