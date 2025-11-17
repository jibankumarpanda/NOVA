"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UserProfile {
  id: string
  name: string
  email: string
  college: string
  skills: string[]
  bio: string
}

interface Project {
  id: string
  title: string
  description: string
  requiredSkills: string[]
  createdBy: string
  members: string[]
  teamSize: number
}

interface MatchResult {
  user: UserProfile
  matchPercentage: number
  matchingSkills: string[]
}

interface CurrentUser {
  id: string
  name: string
  email: string
  college: string
}

export default function DiscoverPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [activeTab, setActiveTab] = useState<"collaborators" | "projects">("collaborators")
  const [availableProjects, setAvailableProjects] = useState<Project[]>([])

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/")
      return
    }

    const userData = JSON.parse(user)
    setCurrentUser(userData)

    // Load and calculate matches
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const currentUserProfile = allUsers.find((u: any) => u.id === userData.id)

    if (currentUserProfile) {
      // Calculate collaborator matches
      const collaboratorMatches = allUsers
        .filter((u: any) => u.id !== userData.id)
        .map((u: any) => {
          const matchingSkills = u.skills.filter((skill: string) => currentUserProfile.skills.includes(skill))
          const totalSkills = new Set([...u.skills, ...currentUserProfile.skills]).size
          const matchPercentage = totalSkills > 0 ? Math.round((matchingSkills.length / totalSkills) * 100) : 0

          return {
            user: {
              id: u.id,
              name: u.name,
              email: u.email,
              college: u.college,
              skills: u.skills,
              bio: u.bio || "",
            },
            matchPercentage,
            matchingSkills,
          }
        })
        .filter((m) => m.matchPercentage > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 10)

      setMatches(collaboratorMatches)

      // Load available projects
      const allProjects = JSON.parse(localStorage.getItem("projects") || "[]")
      const projectMatches = allProjects
        .filter((p: Project) => !p.members.includes(userData.id) && p.createdBy !== userData.id)
        .map((p: Project) => ({
          ...p,
          matchPercentage: Math.round(
            (p.requiredSkills.filter((s) => currentUserProfile.skills.includes(s)).length / p.requiredSkills.length) *
              100,
          ),
        }))
        .sort((a, b) => b.matchPercentage - a.matchPercentage)

      setAvailableProjects(projectMatches)
    }
  }, [router])

  const handleJoinProject = (projectId: string) => {
    if (!currentUser) return

    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]")
    const updated = allProjects.map((p: Project) =>
      p.id === projectId ? { ...p, members: [...p.members, currentUser.id], teamSize: p.teamSize - 1 } : p,
    )
    localStorage.setItem("projects", JSON.stringify(updated))
    setAvailableProjects(availableProjects.filter((p) => p.id !== projectId))
    alert("Successfully joined the project!")
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Your Team</h1>
              <p className="text-gray-600 mt-2">Discover collaborators and projects matched to your skills</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-100">
              <button
                onClick={() => setActiveTab("collaborators")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "collaborators"
                    ? "text-blue-700 border-blue-700"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                Find Collaborators ({matches.length})
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "projects"
                    ? "text-blue-700 border-blue-700"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                Available Projects ({availableProjects.length})
              </button>
            </div>

            {/* Collaborators Tab */}
            {activeTab === "collaborators" && (
              <div className="space-y-4">
                {matches.length === 0 ? (
                  <Card className="border-gray-100">
                    <CardContent className="pt-12 pb-12 text-center">
                      <p className="text-gray-600">Add more skills to your profile to find matching collaborators</p>
                      <Button variant="outline" className="mt-4 bg-transparent" onClick={() => router.push("/profile")}>
                        Update Profile
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  matches.map((match) => (
                    <Card key={match.user.id} className="border-gray-100 hover:border-gray-200 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold">
                                {match.user.name[0]?.toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{match.user.name}</h3>
                                <p className="text-sm text-gray-600">{match.user.college}</p>
                              </div>
                            </div>

                            {match.user.bio && <p className="text-sm text-gray-600 mb-3">{match.user.bio}</p>}

                            {/* Matching Skills */}
                            <div className="mb-3">
                              <p className="text-xs font-medium text-gray-600 mb-2">Matching Skills</p>
                              <div className="flex flex-wrap gap-2">
                                {match.matchingSkills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* All Skills */}
                            <div className="mb-3">
                              <p className="text-xs font-medium text-gray-600 mb-2">Their Skills</p>
                              <div className="flex flex-wrap gap-2">
                                {match.user.skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      match.matchingSkills.includes(skill)
                                        ? "bg-yellow-50 text-yellow-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Match Percentage */}
                          <div className="flex flex-col items-center gap-3 ml-4">
                            <div className="flex flex-col items-center">
                              <span className="text-3xl font-bold text-blue-700">{match.matchPercentage}%</span>
                              <span className="text-xs text-gray-600 mt-1">Match</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-700 border-blue-200 bg-transparent"
                            >
                              Connect
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                {availableProjects.length === 0 ? (
                  <Card className="border-gray-100">
                    <CardContent className="pt-12 pb-12 text-center">
                      <p className="text-gray-600">No projects available at the moment</p>
                    </CardContent>
                  </Card>
                ) : (
                  availableProjects.map((project: any) => (
                    <Card key={project.id} className="border-gray-100 hover:border-gray-200 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          </div>
                          <div className="flex flex-col items-center gap-2 ml-4">
                            <div className="text-3xl font-bold text-blue-700">{project.matchPercentage}%</div>
                            <span className="text-xs text-gray-600">Match</span>
                          </div>
                        </div>

                        {/* Required Skills */}
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-600 mb-2">Required Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {project.requiredSkills.map((skill: string) => (
                              <span
                                key={skill}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  project.requiredSkills
                                    .filter((s: string) => localStorage.getItem("currentUser")?.includes(s))
                                    .includes(skill)
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Info and Actions */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {project.teamSize} {project.teamSize === 1 ? "spot" : "spots"} available
                          </span>
                          <Button
                            size="sm"
                            className="bg-blue-700 hover:bg-blue-800"
                            onClick={() => handleJoinProject(project.id)}
                          >
                            Join Project
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
