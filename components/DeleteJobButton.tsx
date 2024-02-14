"use client"
import React from "react"
import { Button } from "./ui/button"
import { Trash } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "./ui/use-toast"
import { deleteJob } from "@/utils/actions"

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async (jobId: string) => await deleteJob(jobId),
    onSuccess: (data) => {
      if (!data) {
        toast({
          title: "Error",
          description: "Could not delete job",
          variant: "destructive",
        })
        return
      }

      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["stats"] })
      queryClient.invalidateQueries({ queryKey: ["charts"] })

      toast({
        title: "Success",
        description: "Job deleted",
        variant: "default",
      })
    },
  })

  async function handleClick() {
    const confirmation = window.confirm(
      "Are you sure you want to delete this job?"
    )
    if (confirmation) {
      mutate(jobId)
    }
  }

  return (
    <Button
      className="bg-red-500 flex gap-2 hover:bg-red-700"
      size="sm"
      disabled={isPending}
      onClick={handleClick}
    >
      <Trash size={16} />
      <span className="capitalize">{isPending ? "Deleting..." : "Delete"}</span>
    </Button>
  )
}
