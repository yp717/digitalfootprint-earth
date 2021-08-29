import { useCallback, useEffect, useRef } from "react"

// Reusable component that also takes dependencies
const useAnimationFrame = (cb, deps) => {
  const frameRef = useRef()
  const lastRef = useRef(performance.now())
  const initRef = useRef(performance.now())

  const animate = useCallback(() => {
    const now = performance.now()
    const time = (now - initRef.current) / 1000
    const delta = (now - lastRef.current) / 1000
    // In seconds ~> you can do ms or anything in userland
    cb({ time, delta })
    lastRef.current = now
    frameRef.current = requestAnimationFrame(animate)
  }, [cb])

  useEffect(() => {
    if (typeof performance === "undefined" || typeof window === "undefined") {
      return
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [...deps, animate]) // Make sure to change it if the deps change
}

export default useAnimationFrame
