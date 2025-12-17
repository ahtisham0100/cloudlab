"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Copy, LogOut } from "lucide-react"

interface Resume {
  id: string
  title: string
  template: string
  updatedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (!storedUserId) {
      router.push("/auth/login")
      return
    }
    setUserId(storedUserId)

    // Fetch resumes
    fetchResumes(storedUserId)
  }, [router])

  const fetchResumes = async (userId: string) => {
    try {
      const response = await fetch(`/api/resumes?userId=${userId}`)
      const data = await response.json()
      setResumes(data.resumes || [])
    } catch (error) {
      console.error("Error fetching resumes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateResume = async () => {
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: "Untitled Resume",
          template: "modern",
        }),
      })

      const data = await response.json()
      router.push(`/resume/${data.id}`)
    } catch (error) {
      console.error("Error creating resume:", error)
    }
  }

  const handleDelete = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return

    try {
      await fetch(`/api/resumes/${resumeId}`, { method: "DELETE" })
      fetchResumes(userId)
    } catch (error) {
      console.error("Error deleting resume:", error)
    }
  }

  const handleDuplicate = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/resumes/${resumeId}/duplicate`, {
        method: "POST",
      })
      const data = await response.json()
      fetchResumes(userId)
    } catch (error) {
      console.error("Error duplicating resume:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userId")
    router.push("/auth/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Resumes</h1>
            <p className="text-muted-foreground mt-2">Manage and edit your professional resumes</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleCreateResume} size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              New Resume
            </Button>
            <Button onClick={handleLogout} variant="outline" size="lg">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {resumes.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4">No resumes yet. Create your first one!</p>
              <Button onClick={handleCreateResume} size="lg">
                Create Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{resume.title}</CardTitle>
                  <CardDescription className="capitalize">{resume.template} template</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/resume/${resume.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleDuplicate(resume.id)} title="Duplicate">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(resume.id)} title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
