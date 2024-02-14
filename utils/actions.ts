"use server"

import prisma from "./db"
import { auth } from "@clerk/nextjs"
import { JobType, CreateAndEditJobType, createAndEditJobSchema } from "./types"
import { redirect } from "next/navigation"
import { Prisma } from "@prisma/client"
import dayjs from "dayjs"

export async function authenticateAndRedirect(): Promise<string> {
  const { userId } = auth()
  if (!userId) {
    redirect("/")
  }
  return userId
}

export async function createJob(
  job: CreateAndEditJobType
): Promise<JobType | null> {
  const userId = await authenticateAndRedirect()

  try {
    createAndEditJobSchema.parse(job)

    const jobData = (await prisma.job.create({
      data: {
        position: job.position,
        company: job.company,
        location: job.location,
        status: job.status,
        mode: job.mode,
        clerkId: userId!,
      },
    })) as JobType

    return jobData
  } catch (error: any) {
    console.log(`${error.name}: ${error.message}`)
    return null
  }
}

type GetAllJobsType = {
  search?: string
  jobStatus?: string
  page?: number
  limit?: number
}

export async function getSingleJob(id: string): Promise<JobType | null> {
  try {
    const userId = await authenticateAndRedirect()

    const job = (await prisma.job.findUnique({
      where: { id, clerkId: userId! },
    })) as JobType

    if (!job) {
      throw new Error("Job not found")
    }

    return job
  } catch (error: any) {
    console.log(`${error.name}: ${error.message}`)
    redirect("/jobs")
  }
}

export async function getAllJobs({
  search,
  jobStatus = "all",
  page = 1,
  limit = 10,
}: GetAllJobsType): Promise<{
  jobs: JobType[]
  count: number
  page: number
  totalPages: number
}> {
  const userId = await authenticateAndRedirect()

  try {
    let whereClause: Prisma.JobWhereInput = {
      clerkId: userId!,
    }

    if (search) {
      whereClause = {
        OR: [
          {
            position: {
              contains: search,
            },
          },
          {
            company: {
              contains: search,
            },
          },
        ],
      }
    }

    if (jobStatus && jobStatus !== "all") {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      }
    }

    const skip = (page - 1) * limit

    const jobs = (await prisma.job.findMany({
      where: whereClause,
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    })) as JobType[]

    const count = (await prisma.job.count({
      where: whereClause,
    })) as number

    const totalPages = Math.ceil(count / limit)

    return {
      jobs,
      count,
      page,
      totalPages,
    }
  } catch (error: any) {
    console.log(`${error.name}: ${error.message}`)
    return { jobs: [], count: 0, page: 1, totalPages: 0 }
  }
}

export async function updateJob(
  id: string,
  jobValues: CreateAndEditJobType
): Promise<JobType | null> {
  const userId = await authenticateAndRedirect()

  try {
    const job = (await prisma.job.update({
      where: { id, clerkId: userId! },
      data: {
        position: jobValues.position,
        company: jobValues.company,
        location: jobValues.location,
        status: jobValues.status,
        mode: jobValues.mode,
      },
    })) as JobType

    return job
  } catch (error: any) {
    console.log(`${error.name}: ${error.message}`)
    return null
  }
}

export async function deleteJob(id: string): Promise<JobType | null> {
  const userId = await authenticateAndRedirect()

  try {
    if (!userId) {
      throw new Error("Unauthorized")
    }

    const job = (await prisma.job.delete({
      where: {
        id,
        clerkId: userId!,
      },
    })) as JobType

    return job
  } catch (error: any) {
    console.log(`${error.name}: ${error.message}`)
    return null
  }
}

type StatsProps = {
  pending: number
  interview: number
  declined: number
}

export async function getStatsData(): Promise<StatsProps> {
  const userId = await authenticateAndRedirect()

  try {
    const stats = await prisma.job.groupBy({
      where: {
        clerkId: userId!,
      },
      by: ["status"],
      _count: {
        status: true,
      },
    })

    const statsObject = stats.reduce(
      (
        acc: Record<string, number>,
        curr: { status: string; _count: { status: number } }
      ) => {
        acc[curr.status] = curr._count.status
        return acc
      },
      {} as Record<string, number>
    ) as Record<string, number>

    const defaultStats = {
      pending: 0,
      interview: 0,
      declined: 0,
      ...statsObject,
    }

    return defaultStats
  } catch (error: any) {
    console.log(`${error.name}: ${error.message}`)
    redirect("/jobs")
    // return { pending: 0, interview: 0, declined: 0 }
  }
}

export async function getChartsData(): Promise<
  Array<{ date: string; count: number }>
> {
  const userId = await authenticateAndRedirect()
  const sixMonthsAgo = dayjs().subtract(6, "month").toDate()

  try {
    const jobs = (await prisma.job.findMany({
      where: {
        clerkId: userId!,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })) as JobType[]

    let applicationsPerMonth = jobs.reduce((acc, job) => {
      const date = dayjs(job.createdAt).format("MMM YY")

      // Find the index of the existing entry instead of the entry itself
      const existingEntryIndex = acc.findIndex((entry) => entry.date === date)

      if (existingEntryIndex !== -1) {
        // If an existing entry is found, update the count directly in the 'acc' array
        acc[existingEntryIndex].count += 1
      } else {
        // If no existing entry is found, push a new object into the 'acc' array
        acc.push({ date, count: 1 })
      }

      return acc
    }, [] as Array<{ date: string; count: number }>)

    return applicationsPerMonth
  } catch (error: any) {
    console.log(`${error.name}: ${error.message}`)
    redirect("/jobs")
  }
}
