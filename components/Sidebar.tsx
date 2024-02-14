"use client"
import React from "react"
import Logo from "@/assets/logo.svg"
import links from "@/utils/links"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="py-3 px-8 bg-muted h-full">
      <Image src={Logo} alt="logo" className="mx-auto w-48" />
      <div className="flex flex-col mt-16 gap-4">
        {links.map((link, i) => (
          <Button
            asChild
            key={i}
            variant={pathname === link.href ? "default" : "link"}
          >
            <Link href={link.href} className="flex items-center gap-x-2">
              {link.icon}
              <span className="capitalize">{link.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </aside>
  )
}
