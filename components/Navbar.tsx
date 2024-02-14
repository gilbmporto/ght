import React from "react"
import LinksDropdown from "./LinksDropdown"
import ThemeToggle from "./ThemeToggle"
import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Logo from "@/assets/logo.svg"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav
      className="bg-muted py-4 sm:px-16 lg:px-24 px-4 
      flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <Link className="lg:hidden" href="/jobs">
          <Image
            src={Logo}
            alt="logo"
            className="block lg:hidden mx-auto w-[120px]"
          />
        </Link>
        <LinksDropdown />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  )
}
