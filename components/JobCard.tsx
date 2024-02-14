import React from "react"
import { JobType } from "@/utils/types"
import {
  MapPin,
  Briefcase,
  CalendarDays,
  RadioTower,
  Edit,
  Trash,
} from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import JobInfo from "./JobInfo"
import DeleteJobButton from "./DeleteJobButton"

export default function JobCard({ job }: { job: JobType }) {
  const date = new Date(job.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit", // Use '2-digit' to ensure the day is always 2 digits
    month: "2-digit", // Use '2-digit' to ensure the month is always 2 digits
    year: "numeric", // Use 'numeric' for the year
  })

  const bgColor =
    job.status === "pending"
      ? "bg-primary"
      : job.status === "interview"
      ? "bg-emerald-500 hover:bg-emerald-700"
      : "bg-red-500 hover:bg-red-700"

  return (
    <Card className="bg-muted rounded-lg">
      <CardHeader>
        <CardTitle>{job?.position}</CardTitle>
        <CardDescription>{job.company}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="mt-4 grid grid-cols-2 gap-4">
        <JobInfo icon={<Briefcase />} text={job.mode} />
        <JobInfo icon={<CalendarDays />} text={date} />
        <JobInfo icon={<MapPin />} text={job.location} />
        <Badge className={`w-32 justify-center py-1 bg-emerald-600 ${bgColor}`}>
          <JobInfo
            icon={<RadioTower className="w-5 h-5" />}
            text={job.status}
          ></JobInfo>
        </Badge>
      </CardContent>
      <Separator className="my-1" orientation="horizontal" />
      <CardFooter className="flex gap-4 mt-4">
        <Button asChild size="sm">
          <Link href={`/jobs/${job.id}`} className="flex gap-2">
            <Edit size={16} />
            <span className="capitalize">Edit</span>
          </Link>
        </Button>
        <DeleteJobButton jobId={job.id} />
      </CardFooter>
    </Card>
  )
}
