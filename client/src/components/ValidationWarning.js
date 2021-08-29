import React from "react"
import { ExclamationCircleIcon } from "@heroicons/react/solid"

const ValidationWarning = () => {
  return (
    <div className="bg-yellow-400 p-4 rounded-lg flex item-center">
      <ExclamationCircleIcon className="text-black inline-block h-6 w-6" />
      <p className="inline-block text-black font-semibold">
        Please enter a valid URL!
      </p>
    </div>
  )
}

export default ValidationWarning
