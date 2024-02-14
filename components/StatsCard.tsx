import React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"

type StatsCardProps = {
  title: string
  value: number
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <Card className="bg-muted">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="capitalize">{title}</CardTitle>
        <CardDescription className="text-4xl font-bold text-primary mt-[0px!important]">
          {value}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
