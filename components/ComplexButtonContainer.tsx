"use client"
import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

type ButtonContainerProps = {
  currentPage: number
  totalPages: number
}

type ButtonProps = {
  page: number
  active: boolean
}

export default function ComplexButtonContainer({
  currentPage,
  totalPages,
}: ButtonContainerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handlePageChange = (page: number) => {
    const defaultParams = {
      search: searchParams.get("search") || "",
      jobStatus: searchParams.get("jobStatus") || "",
      page: page.toString(),
    }

    let params = new URLSearchParams(defaultParams)

    router.push(`${pathname}?${params.toString()}`)
  }

  const addPageButton = ({ page, active }: ButtonProps) => {
    return (
      <Button
        key={page}
        size="icon"
        variant={active ? "default" : "outline"}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </Button>
    )
  }

  const renderPageButtons = () => {
    const pageButtons = []

    // first page button
    pageButtons.push(addPageButton({ page: 1, active: currentPage === 1 }))

    // dots
    if (currentPage > 3) {
      pageButtons.push(
        <Button size="icon" variant="outline" key="dots-1">
          ...
        </Button>
      )
    }

    if (currentPage > 2) {
      pageButtons.push(
        addPageButton({
          page: currentPage - 1,
          active: false,
        })
      )
    }

    // current page button
    if (currentPage !== 1 && currentPage !== totalPages) {
      pageButtons.push(
        addPageButton({
          page: currentPage,
          active: true,
        })
      )
    }

    if (currentPage < totalPages - 1) {
      pageButtons.push(
        addPageButton({
          page: currentPage + 1,
          active: false,
        })
      )
    }

    // dots
    if (currentPage < totalPages - 2) {
      pageButtons.push(
        <Button size="icon" variant="outline" key="dots-2">
          ...
        </Button>
      )
    }

    // last page button
    pageButtons.push(
      addPageButton({
        page: totalPages,
        active: currentPage === totalPages,
      })
    )

    return pageButtons
  }

  return (
    <div className="flex gap-x-2">
      {/* previous buttons */}
      <Button
        className="flex items-center gap-x-2"
        variant="outline"
        onClick={() => {
          if (currentPage > 1) {
            handlePageChange(currentPage - 1)
          } else {
            handlePageChange(totalPages)
          }
        }}
      >
        <ChevronLeft />
        previous
      </Button>

      {renderPageButtons()}

      {/* next buttons */}
      <Button
        className="flex items-center gap-x-2"
        variant="outline"
        onClick={() => {
          if (currentPage < totalPages) {
            handlePageChange(currentPage + 1)
          } else {
            handlePageChange(1)
          }
        }}
      >
        next
        <ChevronRight />
      </Button>
    </div>
  )
}
