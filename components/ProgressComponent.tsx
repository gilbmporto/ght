import React, { useEffect, useState } from "react"
import { Progress } from "./ui/progress"

export default function ProgressComponent() {
  const [progress, setProgress] = useState(13)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    setTimeout(() => setProgress(90), 1000)
    setTimeout(() => setProgress(100), 1500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} className="w-[60%] mx-auto" />
}
