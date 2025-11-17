"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 z-40 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-700">Collaborate</div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
            Collaborate.
            <br />
            Innovate.
            <br />
            Build Together.
          </h1>

          <p className="text-xl text-gray-600">
            A unified space for students to form teams, match by skills, and manage projects. Find your perfect
            collaborators and bring your ideas to life.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-700 hover:bg-blue-800">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="p-6 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-blue-700 font-bold mb-2">Find Teams</div>
              <p className="text-gray-600 text-sm">
                Discover students with complementary skills and shared project interests.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-blue-700 font-bold mb-2">Match Skills</div>
              <p className="text-gray-600 text-sm">
                Get matched with collaborators based on your expertise and project requirements.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-blue-700 font-bold mb-2">Manage Work</div>
              <p className="text-gray-600 text-sm">
                Organize projects, track progress, and collaborate seamlessly in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>© 2025 Collaborate. Building the future of student collaboration.</p>
        </div>
      </footer>
    </div>
  )
}
