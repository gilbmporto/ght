"use client"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { getStatsData } from "@/utils/actions"
import ProgressComponent from "./ProgressComponent"
import StatsCard from "./StatsCard"

export default function StatsContainer() {
  const { isPending, data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStatsData(),
  })

  if (isPending) {
    return <ProgressComponent />
  }

  return (
    <div className="grid md:gird-cols-2 gap-4 lg:grid-cols-3">
      <StatsCard title="pending jobs" value={data?.pending ?? 0} />
      <StatsCard title="interviews set" value={data?.interview ?? 0} />
      <StatsCard title="jobs declined" value={data?.declined ?? 0} />
    </div>
  )
}
