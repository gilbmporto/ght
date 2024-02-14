"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  JobStatus,
  JobMode,
  CreateAndEditJobType,
  createAndEditJobSchema,
} from "@/utils/types"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { CustomFormField, CustomFormSelect } from "@/components/FormComponents"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createJob } from "@/utils/actions"
import { useRouter } from "next/navigation"
import { useToast } from "./ui/use-toast"

export default function CreateJobForm() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: CreateAndEditJobType) => await createJob(values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          title: "Job Creation Failed",
          description: "There was an error creating the job.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Job Created",
        description: "Your job has been created",
        duration: 5000,
      })

      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["stats"] })
      queryClient.invalidateQueries({ queryKey: ["charts"] })

      router.push("/jobs")
    },
  })

  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: "",
      company: "",
      location: "",
      status: JobStatus.Pending,
      mode: JobMode.FullTime,
    },
  })

  function onSubmit(values: CreateAndEditJobType) {
    mutate(values)
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded-lg"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">Add Job</h2>
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
            {isPending ? "Loading..." : "Create Job"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
