import React from "react"
import EditJobForm from "@/components/EditJobForm"
import { getSingleJob } from "@/utils/actions"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

export default async function SingleJobPage({
  params,
}: {
  params: { id: string }
}) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["job", params.id],
    queryFn: async () => await getSingleJob(params.id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditJobForm jobId={params.id} />
    </HydrationBoundary>
  )
}
