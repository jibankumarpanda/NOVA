"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const AVAILABLE_SKILLS = [
  "Python",
  "JavaScript",
  "React",
  "TypeScript",
  "Node.js",
  "Design",
  "UI/UX",
  "Figma",
  "Product Management",
  "Machine Learning",
  "Data Science",
  "ML",
  "AI",
  "Report Writing",
  "Business Strategy",
  "Marketing",
  "Backend",
  "Frontend",
  "Full Stack",
  "DevOps",
  "Java",
  "C++",
  "Mobile Development",
  "iOS",
  "Android",
]

interface User {
  id: string
  name: string
  email: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: [] as string[],
    deadline: "",
    teamSize: 3,
  })

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(JSON.parse(currentUser))
  }, [router])

  const handleSkillToggle = (skill: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.includes(skill)
        ? formData.requiredSkills.filter((s) => s !== skill)
        : [...formData.requiredSkills, skill],
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation
      if (!formData.title || !formData.description || !formData.deadline) {
        alert("Please fill in all required fields")
        setIsLoading(false)
        return
      }

      if (formData.requiredSkills.length === 0) {
        alert("Please select at least one required skill")
        setIsLoading(false)
        return
      }

      // Create project
      const newProject = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        requiredSkills: formData.requiredSkills,
        deadline: formData.deadline,
        teamSize: formData.teamSize,
        status: "active" as const,
        progress: 0,
        createdBy: user?.id || "",
        members: [user?.id || ""],
        tasks: [],
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      projects.push(newProject)
      localStorage.setItem("projects", JSON.stringify(projects))

      router.push(`/projects/${newProject.id}`)
    } catch (error) {
      alert("Error creating project")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
              <p className="text-gray-600 mt-2">Define your project and find the perfect team members</p>
            </div>

            <Card className="border-gray-100">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Project Title *</label>
                    <Input
                      type="text"
                      placeholder="e.g., AI-Powered Note Taker"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-gray-50 border-gray-200"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Description *</label>
                    <textarea
                      placeholder="Describe your project, goals, and what you're looking for..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-500"
                      rows={5}
                      required
                    />
                  </div>

                  {/* Required Skills */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-900">Required Skills *</label>
                    <p className="text-xs text-gray-600">Select the skills needed for your team</p>

                    {formData.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg">
                        {formData.requiredSkills.map((skill) => (
                          <div
                            key={skill}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleSkillToggle(skill)}
                              className="ml-1 hover:text-blue-900 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SKILLS.filter((s) => !formData.requiredSkills.includes(s)).map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Deadline *</label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="bg-gray-50 border-gray-200"
                      required
                    />
                  </div>

                  {/* Team Size */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Target Team Size</label>
                    <Input
                      type="number"
                      min="2"
                      max="20"
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: Number.parseInt(e.target.value) })}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Project"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
