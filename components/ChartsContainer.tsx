"use client"
import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useQuery } from "@tanstack/react-query"
import { getChartsData } from "@/utils/actions"

export default function ChartsContainer() {
  const { data } = useQuery({
    queryKey: ["charts"],
    queryFn: () => getChartsData(),
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <section className="mt-16">
      <h1 className="text-5xl font-semibold text-center">
        Monthly Applications
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" barSize={75} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
