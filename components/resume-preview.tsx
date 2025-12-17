"use client"

import { MinimalTemplate } from "./templates/minimal-template"
import { ModernTemplate } from "./templates/modern-template"
import { ProfessionalTemplate } from "./templates/professional-template"

interface ResumePreviewProps {
  resume: any
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  if (!resume) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-card rounded-lg">
        <p>Preview will appear here</p>
      </div>
    )
  }

  const renderTemplate = () => {
    switch (resume.template) {
      case "minimal":
        return <MinimalTemplate data={resume.data} />
      case "professional":
        return <ProfessionalTemplate data={resume.data} />
      case "modern":
      default:
        return <ModernTemplate data={resume.data} />
    }
  }

  return (
    <div className="bg-muted p-4 rounded-lg overflow-auto max-h-screen">
      <div className="bg-card">{renderTemplate()}</div>
    </div>
  )
}
