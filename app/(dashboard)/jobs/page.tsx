import React from "react"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { getAllJobs } from "@/utils/actions"
import SearchForm from "@/components/SearchForm"
import JobsList from "@/components/JobsList"

export default async function JobsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["jobs", "", "all", 1],
    queryFn: async () => await getAllJobs({}),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchForm />
      <JobsList />
    </HydrationBoundary>
  )
}
