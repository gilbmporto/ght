import React from "react"
import { getStatsData, getChartsData } from "@/utils/actions"
import StatsContainer from "@/components/StatsContainer"
import ChartsContainer from "@/components/ChartsContainer"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

export default async function StatsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["stats"],
    queryFn: async () => await getStatsData(),
  })
  await queryClient.prefetchQuery({
    queryKey: ["charts"],
    queryFn: async () => await getChartsData(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatsContainer />
      <ChartsContainer />
    </HydrationBoundary>
  )
}
