"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/profile", label: "My Profile", icon: "👤" },
    { href: "/projects", label: "My Projects", icon: "📁" },
    { href: "/discover", label: "Find Teams", icon: "🔍" },
  ]

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 pt-20 transition-transform md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <nav className="space-y-1 px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              pathname === link.href ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-50",
            )}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
