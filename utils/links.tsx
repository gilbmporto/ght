import { AreaChart, Layers, AppWindow } from "lucide-react"

type NavOption = {
  href: string
  label: string
  icon: React.ReactNode
}

const links: NavOption[] = [
  {
    href: "/add-job",
    label: "Add Job",
    icon: <Layers />,
  },
  {
    href: "/jobs",
    label: "jobs",
    icon: <AppWindow />,
  },
  {
    href: "/stats",
    label: "stats",
    icon: <AreaChart />,
  },
]

export default links
