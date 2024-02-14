"use client"
import React from "react"
import { Input } from "./ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "./ui/select"
import { JobStatus } from "@/utils/types"

export default function SearchForm() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchWord = searchParams.get("search") || ""
  const jobStatus = searchParams.get("jobStatus") || ""

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get("search") as string
    const status = formData.get("jobStatus") as string

    let params = new URLSearchParams()
    params.set("search", search)
    params.set("jobStatus", status)

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-muted mb-16 p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-lg"
    >
      <Input
        type="text"
        defaultValue={searchWord}
        placeholder="Search Jobs here..."
        name="search"
      />
      <Select name="jobStatus" value={jobStatus === "" ? "all" : jobStatus}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent defaultValue={"all"}>
          {["all", ...Object.values(JobStatus)].map((status) => (
            <SelectItem key={status} value={status}>
              {status.slice(0, 1).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit">Search</Button>
    </form>
  )
}
