import * as z from "zod"

export type JobType = {
  id: string
  createdAt: Date
  updatedAt: Date
  clerkId: string
  company: string
  position: string
  status: string
  mode: string
  location: string
}

export enum JobStatus {
  Pending = "pending",
  Interview = "interview",
  Declined = "declined",
}

export enum JobMode {
  FullTime = "full-time",
  PartTime = "part-time",
  Internship = "internship",
}
// Enums in TypeScript are a special type that allows you to define a set of named constants. They can be numeric or string-based.

export const createAndEditJobSchema = z.object({
  position: z.string().min(3, {
    message: "position must be at least 3 characters.",
  }),
  company: z.string().min(3, {
    message: "company must be at least 3 characters.",
  }),
  location: z.string().min(3, {
    message: "location must be at least 3 characters.",
  }),
  status: z.nativeEnum(JobStatus),
  mode: z.nativeEnum(JobMode),
})

export type CreateAndEditJobType = z.infer<typeof createAndEditJobSchema>
