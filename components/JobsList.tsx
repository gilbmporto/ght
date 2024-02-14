"use client"
import React from "react"
import JobCard from "./JobCard"
import { useSearchParams } from "next/navigation"
import { getAllJobs } from "@/utils/actions"
import { useQuery } from "@tanstack/react-query"
import ProgressComponent from "./ProgressComponent"
// import ButtonContainer from "./ButtonContainer"
import ComplexButtonContainer from "./ComplexButtonContainer"

export default function JobsList() {
  const searchParams = useSearchParams()
  const jobStatus = searchParams.get("jobStatus") || ""
  const search = searchParams.get("search") || ""
  const pageNumber = Number(searchParams.get("page")) || 1

  const { data, isPending } = useQuery({
    queryKey: ["jobs", search, jobStatus, pageNumber],
    queryFn: async () =>
      await getAllJobs({ jobStatus, search, page: pageNumber }),
  })

  const jobs = data?.jobs || []
  const count = data?.count || 0
  const page = data?.page || 1
  const totalPages = data?.totalPages || 0

  if (isPending) {
    return <ProgressComponent />
  }

  if (jobs.length === 0) {
    return <h2 className="text-xl">No jobs found!</h2>
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold capitalize">{count} jobs found</h2>
        {totalPages < 2 ? null : (
          <ComplexButtonContainer currentPage={page} totalPages={totalPages} />
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {jobs.map((job) => {
          return <JobCard key={job.id} job={job} />
        })}
      </div>
    </>
  )
}
