"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ResumeEditor } from "@/components/resume-editor"
import { ResumePreview } from "@/components/resume-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ResumeEditPage() {
  const params = useParams()
  const router = useRouter()
  const [resume, setResume] = useState(null)
  const [template, setTemplate] = useState("modern")
  const [isExporting, setIsExporting] = useState(false)

  const resumeId = typeof params.id === "string" ? params.id : ""

  useEffect(() => {
    if (resume?.template) {
      setTemplate(resume.template)
    }
  }, [resume])

  const handleTemplateChange = async (newTemplate: string) => {
    setTemplate(newTemplate)
    if (resume) {
      const updatedResume = { ...resume, template: newTemplate }
      setResume(updatedResume)

      await fetch(`/api/resumes/${resumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: newTemplate,
        }),
      })
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/resumes/${resumeId}/export?format=html`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `resume-${resume?.title || "export"}.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportJSON = () => {
    if (!resume) return
    const dataStr = JSON.stringify(resume, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = window.URL.createObjectURL(dataBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = `resume-${resume?.title || "export"}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Template:</span>
              <Select value={template} onValueChange={handleTemplateChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleExportPDF} disabled={isExporting} className="gap-2">
              <Download className="w-4 h-4" />
              PDF
            </Button>
            <Button onClick={handleExportJSON} variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              JSON
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ResumeEditor resumeId={resumeId} onSave={setResume} />
          </div>
          <div className="hidden lg:block sticky top-8 self-start">
            <ResumePreview resume={resume ? { ...resume, template } : null} />
          </div>
        </div>
      </div>
    </div>
  )
}
