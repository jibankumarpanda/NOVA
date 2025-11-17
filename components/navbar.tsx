"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Navbar() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = () => {
    setIsLoading(true)
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const currentUser = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null
  const user = currentUser ? JSON.parse(currentUser) : null

  return (
    <nav className="border-b border-gray-100 sticky top-0 z-40 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-700">
          Collaborate
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900 font-medium">
                Profile
              </Link>
              <Link href="/projects" className="text-gray-600 hover:text-gray-900 font-medium">
                Projects
              </Link>
              <Link href="/discover" className="text-gray-600 hover:text-gray-900 font-medium">
                Find Teams
              </Link>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoading}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
