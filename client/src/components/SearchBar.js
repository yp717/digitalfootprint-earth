import React from "react"

import { SearchIcon } from "@heroicons/react/solid"

import { useStory } from "../context/story-context"

// useEffect with timeout that sets validationError back to false
const SearchBar = () => {
  const { userInput, setUserInput, submitURL, setValidationError } = useStory()
  return (
    <div className="border-4 border-yellow-400 rounded-full flex p-1 mx-4 w-full max-w-lg">
      <input
        value={userInput}
        onChange={e => {
          setUserInput(e.target.value)
          setValidationError(false)
        }}
        onKeyDown={e => e.key === "Enter" && submitURL(userInput)}
        placeholder="your-website.com"
        className="w-full bg-transparent text-lg md:text-2xl text-white px-1 md:px-2 mx-2 focus:outline-none"
      />
      <button
        onClick={() => submitURL(userInput)}
        className="bg-yellow-400 hover:bg-yellow-500 rounded-full text-white p-2"
      >
        <SearchIcon className="h-4 w-4 md:h-6 md:w-6" />
      </button>
    </div>
  )
}

export default SearchBar
