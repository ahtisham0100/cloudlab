"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [userId, setUserId] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (!storedUserId) {
      router.push("/auth/login")
      return
    }
    setUserId(storedUserId)

    // In a real app, fetch user data here
    // For now, just load from local storage if available
    const savedName = localStorage.getItem("userName")
    const savedEmail = localStorage.getItem("userEmail")
    if (savedName) setFormData((prev) => ({ ...prev, name: savedName }))
    if (savedEmail) setFormData((prev) => ({ ...prev, email: savedEmail }))
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      // Save to local storage for demo
      localStorage.setItem("userName", formData.name)
      localStorage.setItem("userEmail", formData.email)
      setMessage("Profile updated successfully!")
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match")
      return
    }

    setIsLoading(true)
    try {
      // In a real app, verify current password and update
      setMessage("Password changed successfully!")
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (err) {
      setError("Failed to change password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return

    setIsLoading(true)
    try {
      localStorage.removeItem("userId")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
      router.push("/auth/login")
    } catch (err) {
      setError("Failed to delete account")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {message && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your name and email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Password</label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Deleting your account will remove all your resumes and data permanently.
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
