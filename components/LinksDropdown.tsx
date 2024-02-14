import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlignLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import links from "@/utils/links"
import Link from "next/link"

export default function LinksDropdown() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon">
            <AlignLeft />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-52 lg:hidden"
          align="start"
          sideOffset={18}
        >
          {links.map((link, i) => (
            <DropdownMenuItem key={i}>
              <Link href={link.href} className="flex items-center gap-2">
                {link.icon} <span className="capitalize">{link.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
