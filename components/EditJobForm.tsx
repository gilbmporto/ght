"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  JobStatus,
  JobMode,
  createAndEditJobSchema,
  CreateAndEditJobType,
} from "@/utils/types"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { CustomFormField, CustomFormSelect } from "./FormComponents"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { getSingleJob, updateJob } from "@/utils/actions"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function EditJobForm({ jobId }: { jobId: string }) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  const { data } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => getSingleJob(jobId),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: CreateAndEditJobType) =>
      await updateJob(jobId, values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: "there was an error",
        })
        return
      }
      toast({
        title: "Job updated!",
        description: "Your job has been updated successfully.",
        duration: 5000,
        variant: "default",
      })
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["job", jobId] })
      queryClient.invalidateQueries({ queryKey: ["stats"] })
      router.push("/jobs")
    },
  })

  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: data?.position || "",
      company: data?.company || "",
      location: data?.location || "",
      status: (data?.status as JobStatus) || JobStatus.Pending,
      mode: (data?.mode as JobMode) || JobMode.FullTime,
    },
  })

  function onSubmit(values: CreateAndEditJobType) {
    const confirmation = window.confirm(
      "Are you sure you want to update this job?"
    )
    if (confirmation) {
      mutate(values)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">edit job</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          <CustomFormField name="position" control={form.control} />

          <CustomFormField name="company" control={form.control} />

          <CustomFormField name="location" control={form.control} />

          <CustomFormSelect
            name="status"
            control={form.control}
            label="job status"
            items={Object.values(JobStatus)}
          />

          <CustomFormSelect
            name="mode"
            control={form.control}
            label="job mode"
            items={Object.values(JobMode)}
          />

          <Button
            type="submit"
            className="self-end capitalize"
            disabled={isPending}
          >
            {isPending ? "updating..." : "update"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
