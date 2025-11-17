"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  requiredSkills: string[]
  status: "active" | "completed"
  progress: number
  teamSize: number
  deadline: string
  createdBy: string
  members: string[]
}

interface User {
  id: string
  name: string
  email: string
  college: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load user's projects
    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]")
    const userProjects = allProjects.filter((p: Project) => p.createdBy === userData.id)
    setProjects(userProjects)
  }, [router])

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true
    return p.status === filter
  })

  const handleDelete = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const allProjects = JSON.parse(localStorage.getItem("projects") || "[]")
      const updated = allProjects.filter((p: Project) => p.id !== projectId)
      localStorage.setItem("projects", JSON.stringify(updated))
      setProjects(projects.filter((p) => p.id !== projectId))
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                <p className="text-gray-600 mt-2">Manage and track your projects</p>
              </div>
              <Link href="/projects/new">
                <Button className="bg-blue-700 hover:bg-blue-800">Create Project</Button>
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4">
              {(["all", "active", "completed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === tab ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                  {tab === "all" ? projects.length : projects.filter((p) => p.status === tab).length})
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <Card className="border-gray-100">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-gray-600 mb-4">No projects yet</p>
                  <Link href="/projects/new">
                    <Button variant="outline">Create Your First Project</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="border-gray-100 hover:border-gray-200 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${
                            project.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-600 mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {project.requiredSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Progress</span>
                          <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-700 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Meta Info and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>Team: {project.teamSize} members</span>
                          <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/projects/${project.id}`}>
                            <Button variant="outline" size="sm">
                              View Board
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(project.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
