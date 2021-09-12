import React, { useState } from "react"
import { useStory } from "../context/story-context"
import {
  GlobeIcon
} from "@heroicons/react/outline"
const Overlay = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  // can also pull out auditScores from the story
  const { currentStoryItem, toggleTools } = useStory()
    const {overlay, overlayColor} = currentStoryItem;

    if(overlay){
        return (
            <div className="absolute top-0 right-0 h-full w-full z-10">
              <div className="w-full h-full flex flex-col items-center justify-center">
                {/* <GlobeIcon className={`w-64 h-64 ${overlayColor}`}/> */}
            </div>
            </div>
          )
    }
    return null
}

export default Overlay
