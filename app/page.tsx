"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, Download, ArrowRight } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    setIsLoggedIn(!!userId)

    if (userId) {
      router.push("/dashboard")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            <span className="text-xl font-bold">Resume Builder</span>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-balance">Create Your Professional Resume in Minutes</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Build a stunning resume with our AI-powered builder. Choose from multiple templates, get AI suggestions, and
          export in any format.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2">
              Start Building <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-primary mb-2" />
                <CardTitle>AI-Powered Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get intelligent suggestions for your professional summary, skills, and experience descriptions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Multiple Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose from modern, minimal, or professional templates. Switch anytime without losing your data.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Download className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Easy Export</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Export your resume as PDF or JSON. Download and share with confidence.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to build your resume?</h2>
        <Link href="/auth/signup">
          <Button size="lg" className="gap-2">
            Get Started Now <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>Resume Builder - Create professional resumes with ease</p>
        </div>
      </footer>
    </div>
  )
}
