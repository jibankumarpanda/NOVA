"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [college, setCollege] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validation
      if (!name || !email || !password || !college) {
        setError("All fields are required")
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      if (users.some((u: any) => u.email === email)) {
        setError("Email already registered")
        setIsLoading(false)
        return
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In production, this should be hashed
        college,
        skills: [],
        projects: [],
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Auto-login
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          college: newUser.college,
        }),
      )

      router.push("/profile")
    } catch (err) {
      setError("An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Join Collaborate</h1>
          <p className="text-gray-600 mt-2">Start finding your perfect collaborators</p>
        </div>

        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Sign up to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">College</label>
                <Input
                  type="text"
                  placeholder="Your College Name"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-blue-700 hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
