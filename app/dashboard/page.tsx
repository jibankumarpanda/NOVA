"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  status: "active" | "completed"
  progress: number
  teamSize: number
  deadline: string
}

interface User {
  id: string
  name: string
  email: string
  college: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load user's projects
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const userProfile = allUsers.find((u: any) => u.id === userData.id)
    if (userProfile && userProfile.projects) {
      setProjects(userProfile.projects)
    }
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
              <p className="text-gray-600 mt-2">{user.college}</p>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-gray-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {projects.filter((p) => p.status === "active").length}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {projects.reduce((sum, p) => sum + p.teamSize, 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {projects.filter((p) => p.status === "completed").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
                <Link href="/projects/new">
                  <Button className="bg-blue-700 hover:bg-blue-800">New Project</Button>
                </Link>
              </div>

              {projects.length === 0 ? (
                <Card className="border-gray-100">
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-gray-600 mb-4">You haven't created any projects yet</p>
                    <Link href="/projects/new">
                      <Button variant="outline">Create Your First Project</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="border-gray-100">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{project.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                              <span>Team: {project.teamSize}</span>
                              <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-700 h-2 rounded-full transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{project.progress}% complete</p>
                          </div>
                          <Link href={`/projects/${project.id}`}>
                            <Button variant="outline" size="sm">
                              View Board
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
