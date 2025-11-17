"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

interface UserProfile {
  id: string
  name: string
  email: string
  college: string
  skills: string[]
  bio: string
  avatar?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<UserProfile | null>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const userProfile = allUsers.find((u: any) => u.id === userData.id)

    if (userProfile) {
      setUser({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        college: userProfile.college,
        skills: userProfile.skills || [],
        bio: userProfile.bio || "",
        avatar: userProfile.avatar,
      })
      setFormData({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        college: userProfile.college,
        skills: userProfile.skills || [],
        bio: userProfile.bio || "",
        avatar: userProfile.avatar,
      })
    }
  }, [router])

  const handleSkillToggle = (skill: string) => {
    if (!formData) return

    setFormData({
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter((s) => s !== skill)
        : [...formData.skills, skill],
    })
  }

  const handleSave = () => {
    if (!formData) return

    setIsSaving(true)
    try {
      // Update user in localStorage
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = allUsers.map((u: any) =>
        u.id === formData.id
          ? {
              ...u,
              name: formData.name,
              college: formData.college,
              skills: formData.skills,
              bio: formData.bio,
              avatar: formData.avatar,
            }
          : u,
      )

      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Update current user
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: formData.id,
          name: formData.name,
          email: formData.email,
          college: formData.college,
        }),
      )

      setUser(formData)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  if (!user || !formData) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-2">Manage your profile and skills</p>
              </div>
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => {
                  if (isEditing) {
                    setFormData(user)
                  }
                  setIsEditing(!isEditing)
                }}
                className={!isEditing ? "bg-blue-700 hover:bg-blue-800" : ""}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {/* Profile Card */}
            <Card className="border-gray-100">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-gray-50 border-gray-200"
                      />
                    ) : (
                      <p className="text-gray-900">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">College</label>
                    {isEditing ? (
                      <Input
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        className="bg-gray-50 border-gray-200"
                      />
                    ) : (
                      <p className="text-gray-900">{user.college}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900">{user.bio || "No bio yet"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="border-gray-100">
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>
                  {isEditing ? "Select your skills to help find the perfect collaborators" : "Your current skills"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Selected Skills */}
                  {formData.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-3">
                        Selected Skills ({formData.skills.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill) => (
                          <div
                            key={skill}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                          >
                            {skill}
                            {isEditing && (
                              <button
                                onClick={() => handleSkillToggle(skill)}
                                className="ml-1 hover:text-blue-900 font-bold"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Skills */}
                  {isEditing && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-3">Available Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_SKILLS.filter((s) => !formData.skills.includes(s)).map((skill) => (
                          <button
                            key={skill}
                            onClick={() => handleSkillToggle(skill)}
                            className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            + {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.skills.length === 0 && !isEditing && (
                    <p className="text-gray-600 text-sm">No skills added yet</p>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-6 flex gap-3">
                    <Button onClick={handleSave} className="bg-blue-700 hover:bg-blue-800" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormData(user)
                        setIsEditing(false)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
