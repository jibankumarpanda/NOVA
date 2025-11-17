"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  assignedTo: string
  priority: "low" | "medium" | "high"
  createdAt: string
}

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
  tasks: Task[]
}

interface User {
  id: string
  name: string
  email: string
}

interface TeamMember {
  id: string
  name: string
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  // Load project and user data
  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/")
      return
    }

    const userData = JSON.parse(user)
    setCurrentUser(userData)

    // Load project
    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]")
    const currentProject = allProjects.find((p: Project) => p.id === projectId)

    if (!currentProject) {
      router.push("/projects")
      return
    }

    setProject(currentProject)

    // Load team members
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const members = currentProject.members
      .map((memberId: string) => {
        const user = allUsers.find((u: any) => u.id === memberId)
        return { id: user?.id, name: user?.name }
      })
      .filter((m: any) => m.id)

    setTeamMembers(members)
  }, [projectId, router])

  // Add new task
  const handleAddTask = () => {
    if (!project || !currentUser || !newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      status: "todo",
      assignedTo: currentUser.id,
      priority: "medium",
      createdAt: new Date().toISOString(),
    }

    const updatedProject = {
      ...project,
      tasks: [...(project.tasks || []), newTask],
    }

    // Update localStorage
    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]")
    const updated = allProjects.map((p: Project) => (p.id === project.id ? updatedProject : p))
    localStorage.setItem("projects", JSON.stringify(updated))

    setProject(updatedProject)
    setNewTaskTitle("")
    setNewTaskDescription("")
    setShowNewTaskForm(false)
  }

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    if (!project) return

    const updatedProject = {
      ...project,
      tasks: project.tasks.filter((t) => t.id !== taskId),
    }

    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]")
    const updated = allProjects.map((p: Project) => (p.id === project.id ? updatedProject : p))
    localStorage.setItem("projects", JSON.stringify(updated))

    setProject(updatedProject)
  }

  // Handle drag and drop
  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (newStatus: "todo" | "in-progress" | "done") => {
    if (!draggedTask || !project) return

    const updatedTasks = project.tasks.map((t) => (t.id === draggedTask.id ? { ...t, status: newStatus } : t))

    const completedTasks = updatedTasks.filter((t) => t.status === "done").length
    const progress = Math.round((completedTasks / updatedTasks.length) * 100)

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      progress,
    }

    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]")
    const updated = allProjects.map((p: Project) => (p.id === project.id ? updatedProject : p))
    localStorage.setItem("projects", JSON.stringify(updated))

    setProject(updatedProject)
    setDraggedTask(null)
  }

  const renderColumn = (status: "todo" | "in-progress" | "done", title: string) => {
    const tasks = project?.tasks.filter((t) => t.status === status) || []

    return (
      <div
        key={status}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(status)}
        className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100 min-h-[600px] flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded">{tasks.length}</span>
        </div>

        <div className="space-y-3 flex-1">
          {tasks.map((task) => {
            const assignee = teamMembers.find((m) => m.id === task.assignedTo)
            return (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task)}
                className="p-3 bg-white rounded-lg border border-gray-200 cursor-move hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm flex-1">{task.title}</h4>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-gray-400 hover:text-red-600 text-lg font-bold ml-2"
                  >
                    ×
                  </button>
                </div>

                {task.description && <p className="text-xs text-gray-600 mb-2">{task.description}</p>}

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-600">{assignee ? assignee.name : "Unassigned"}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (!project || !currentUser) return null

  const completedTasks = project.tasks.filter((t) => t.status === "done").length
  const progress = project.tasks.length > 0 ? Math.round((completedTasks / project.tasks.length) * 100) : 0

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-600 mt-2">{project.description}</p>
              </div>
              <Button variant="outline" onClick={() => router.back()}>
                Back to Projects
              </Button>
            </div>

            {/* Progress and Team Info */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-gray-100">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-gray-600 mb-3">Progress</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-700 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{progress}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {completedTasks} of {project.tasks.length} tasks complete
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-100">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-gray-600 mb-3">Team Members</p>
                  <div className="space-y-2">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                          {member.name[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-900">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-100">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-gray-600 mb-3">Deadline</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(project.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                    remaining
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* New Task Form */}
            {showNewTaskForm && (
              <Card className="border-gray-100">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Task Title</label>
                    <Input
                      placeholder="Enter task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="bg-gray-50 border-gray-200"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                    <textarea
                      placeholder="Enter task description (optional)..."
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleAddTask} className="bg-blue-700 hover:bg-blue-800">
                      Add Task
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewTaskForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Kanban Board */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Task Board</h2>
                <Button onClick={() => setShowNewTaskForm(!showNewTaskForm)} className="bg-blue-700 hover:bg-blue-800">
                  Add Task
                </Button>
              </div>

              <div className="flex gap-4">
                {renderColumn("todo", "To-Do")}
                {renderColumn("in-progress", "In Progress")}
                {renderColumn("done", "Done")}
              </div>
            </div>

            {/* Empty State */}
            {project.tasks.length === 0 && !showNewTaskForm && (
              <Card className="border-gray-100">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-gray-600 mb-4">No tasks yet. Create your first task to get started!</p>
                  <Button onClick={() => setShowNewTaskForm(true)} variant="outline">
                    Create Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
