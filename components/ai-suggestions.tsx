"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wand2 } from "lucide-react"

interface AISuggestionsProps {
  resumeData: any
  onApplySummary: (summary: string) => void
  onApplySkills: (skills: string[]) => void
}

export function AISuggestions({ resumeData, onApplySummary, onApplySkills }: AISuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any>(null)
  const [atsScore, setAtsScore] = useState<any>(null)

  const generateSummary = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "summary",
          data: {
            role: "Professional",
            yearsExperience: resumeData?.experience?.length || 0,
            skills: resumeData?.skills || [],
          },
        }),
      })

      const data = await response.json()
      setSuggestions({ type: "summary", content: data.result })
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const suggestSkills = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "skills",
          data: { role: "Software Engineer" },
        }),
      })

      const data = await response.json()
      setSuggestions({ type: "skills", content: data.result })
    } catch (error) {
      console.error("Error suggesting skills:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAtsScore = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ats",
          data: { resume: resumeData },
        }),
      })

      const data = await response.json()
      setAtsScore(data.result)
    } catch (error) {
      console.error("Error calculating ATS score:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Suggestions
          </CardTitle>
          <CardDescription>Get intelligent suggestions to improve your resume</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={generateSummary} disabled={isLoading} variant="outline" size="sm">
              Generate Summary
            </Button>
            <Button onClick={suggestSkills} disabled={isLoading} variant="outline" size="sm">
              Suggest Skills
            </Button>
            <Button onClick={calculateAtsScore} disabled={isLoading} variant="outline" size="sm">
              Check ATS Score
            </Button>
          </div>

          {suggestions && suggestions.type === "summary" && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Suggested Summary:</p>
              <p className="text-sm bg-muted p-3 rounded">{suggestions.content}</p>
              <Button onClick={() => onApplySummary(suggestions.content)} size="sm">
                Apply
              </Button>
            </div>
          )}

          {suggestions && suggestions.type === "skills" && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Suggested Skills:</p>
              <div className="flex flex-wrap gap-2 p-3 bg-muted rounded">
                {suggestions.content.map((skill: string) => (
                  <span key={skill} className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
              <Button onClick={() => onApplySkills(suggestions.content)} size="sm">
                Apply All
              </Button>
            </div>
          )}

          {atsScore && (
            <div className="space-y-2">
              <p className="text-sm font-medium">ATS Score: {atsScore.score}/100</p>
              {atsScore.suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Suggestions:</p>
                  <ul className="text-xs space-y-1">
                    {atsScore.suggestions.map((suggestion: string, idx: number) => (
                      <li key={idx} className="text-muted-foreground">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
