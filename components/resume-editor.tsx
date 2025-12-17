"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Save, Loader2 } from "lucide-react"
import { generateId } from "@/lib/utils"

interface ResumeData {
  id: string
  userId: string
  title: string
  template: "minimal" | "modern" | "professional"
  data: {
    personalInfo: {
      name: string
      email: string
      phone: string
      location: string
      summary: string
    }
    education: Array<{
      id: string
      school: string
      degree: string
      field: string
      startDate: string
      endDate: string
    }>
    experience: Array<{
      id: string
      company: string
      position: string
      startDate: string
      endDate: string
      current: boolean
      description: string
    }>
    skills: string[]
    projects: Array<{
      id: string
      name: string
      description: string
      link: string
    }>
    achievements: string[]
  }
}

interface ResumeEditorProps {
  resumeId: string
  onSave: (data: ResumeData) => void
}

export function ResumeEditor({ resumeId, onSave }: ResumeEditorProps) {
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resumes/${resumeId}`)
        const data = await response.json()
        setResume(data)
        onSave(data)
      } catch (error) {
        console.error("Error fetching resume:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchResume()
  }, [resumeId, onSave])

  const debouncedSave = useCallback(
    (resumeData: ResumeData) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSaving(true)
          const response = await fetch(`/api/resumes/${resumeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resumeData),
          })

          if (response.ok) {
            const updated = await response.json()
            setLastSaved(new Date())
            onSave(updated)
          } else {
            console.error("Failed to save resume:", await response.text())
          }
        } catch (error) {
          console.error("Error saving resume:", error)
        } finally {
          setIsSaving(false)
        }
      }, 1000)
    },
    [resumeId, onSave],
  )

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const updateResume = useCallback(
    (updates: Partial<ResumeData>) => {
      if (!resume) return
      const updatedResume = { ...resume, ...updates }
      setResume(updatedResume)
      debouncedSave(updatedResume)
    },
    [resume, debouncedSave],
  )

  const handleSave = async () => {
    if (!resume) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      })

      if (response.ok) {
        const updated = await response.json()
        setResume(updated)
        onSave(updated)
        setLastSaved(new Date())
      } else {
        console.error("Failed to save resume:", await response.text())
      }
    } catch (error) {
      console.error("Error saving resume:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const addEducation = () => {
    if (!resume) return
    const newEducation = {
      id: generateId(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
    }
    setResume({
      ...resume,
      data: {
        ...resume.data,
        education: [...resume.data.education, newEducation],
      },
    })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    if (!resume) return
    const newEducation = [...resume.data.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setResume({
      ...resume,
      data: {
        ...resume.data,
        education: newEducation,
      },
    })
  }

  const deleteEducation = (index: number) => {
    if (!resume) return
    setResume({
      ...resume,
      data: {
        ...resume.data,
        education: resume.data.education.filter((_, i) => i !== index),
      },
    })
  }

  const addExperience = () => {
    if (!resume) return
    const newExperience = {
      id: generateId(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setResume({
      ...resume,
      data: {
        ...resume.data,
        experience: [...resume.data.experience, newExperience],
      },
    })
  }

  const updateExperience = (index: number, field: string, value: string | boolean) => {
    if (!resume) return
    const newExperience = [...resume.data.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    setResume({
      ...resume,
      data: {
        ...resume.data,
        experience: newExperience,
      },
    })
  }

  const deleteExperience = (index: number) => {
    if (!resume) return
    setResume({
      ...resume,
      data: {
        ...resume.data,
        experience: resume.data.experience.filter((_, i) => i !== index),
      },
    })
  }

  const addProject = () => {
    if (!resume) return
    const newProject = {
      id: generateId(),
      name: "",
      description: "",
      link: "",
    }
    setResume({
      ...resume,
      data: {
        ...resume.data,
        projects: [...resume.data.projects, newProject],
      },
    })
  }

  const updateProject = (index: number, field: string, value: string) => {
    if (!resume) return
    const newProjects = [...resume.data.projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    setResume({
      ...resume,
      data: {
        ...resume.data,
        projects: newProjects,
      },
    })
  }

  const deleteProject = (index: number) => {
    if (!resume) return
    setResume({
      ...resume,
      data: {
        ...resume.data,
        projects: resume.data.projects.filter((_, i) => i !== index),
      },
    })
  }

  if (isLoading || !resume) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{resume.title}</h2>
        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </span>
          )}
          {!isSaving && lastSaved && (
            <span className="text-sm text-muted-foreground">Saved {new Date(lastSaved).toLocaleTimeString()}</span>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            Save Now
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={resume.data.personalInfo?.name || ""}
                  onChange={(e) =>
                    updateResume({
                      data: {
                        ...resume.data,
                        personalInfo: {
                          ...resume.data.personalInfo,
                          name: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={resume.data.personalInfo?.email || ""}
                  onChange={(e) =>
                    updateResume({
                      data: {
                        ...resume.data,
                        personalInfo: {
                          ...resume.data.personalInfo,
                          email: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={resume.data.personalInfo?.phone || ""}
                  onChange={(e) =>
                    updateResume({
                      data: {
                        ...resume.data,
                        personalInfo: {
                          ...resume.data.personalInfo,
                          phone: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  value={resume.data.personalInfo?.location || ""}
                  onChange={(e) =>
                    updateResume({
                      data: {
                        ...resume.data,
                        personalInfo: {
                          ...resume.data.personalInfo,
                          location: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Experienced software engineer with 5+ years building scalable web applications..."
                  value={resume.data.personalInfo?.summary || ""}
                  onChange={(e) =>
                    updateResume({
                      data: {
                        ...resume.data,
                        personalInfo: {
                          ...resume.data.personalInfo,
                          summary: e.target.value,
                        },
                      },
                    })
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Education</h3>
                <Button onClick={addEducation} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Education
                </Button>
              </div>
              {resume.data.education.map((edu, index) => (
                <div key={edu.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">School {index + 1}</h3>
                    <Button variant="destructive" size="sm" onClick={() => deleteEducation(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`school-${index}`}>School Name</Label>
                      <Input
                        id={`school-${index}`}
                        placeholder="Stanford University"
                        value={edu.school}
                        onChange={(e) => updateEducation(index, "school", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        placeholder="Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`field-${index}`}>Field of Study</Label>
                      <Input
                        id={`field-${index}`}
                        placeholder="Computer Science"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, "field", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                      <Input
                        id={`startDate-${index}`}
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${index}`}>End Date</Label>
                      <Input
                        id={`endDate-${index}`}
                        type="date"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Experience</h3>
                <Button onClick={addExperience} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Experience
                </Button>
              </div>
              {resume.data.experience.map((exp, index) => (
                <div key={exp.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Job {index + 1}</h3>
                    <Button variant="destructive" size="sm" onClick={() => deleteExperience(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`company-${index}`}>Company</Label>
                      <Input
                        id={`company-${index}`}
                        placeholder="Tech Company Inc."
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`position-${index}`}>Position</Label>
                      <Input
                        id={`position-${index}`}
                        placeholder="Senior Software Engineer"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, "position", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                      <Input
                        id={`startDate-${index}`}
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${index}`}>End Date</Label>
                      <Input
                        id={`endDate-${index}`}
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(index, "current", e.target.checked)}
                      id={`current-${index}`}
                    />
                    <Label htmlFor={`current-${index}`} className="text-sm">
                      I currently work here
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      placeholder="Led a team of 5 developers to build a microservices architecture that improved performance by 40%. Implemented CI/CD pipelines using Docker and Kubernetes."
                      value={exp.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Skills</h3>
                <Button
                  onClick={() =>
                    updateResume({
                      data: {
                        ...resume.data,
                        skills: [...resume.data.skills, ""],
                      },
                    })
                  }
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </Button>
              </div>
              {resume.data.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...resume.data.skills]
                      newSkills[index] = e.target.value
                      updateResume({
                        data: {
                          ...resume.data,
                          skills: newSkills,
                        },
                      })
                    }}
                    placeholder="React, TypeScript, Node.js, MongoDB"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newSkills = resume.data.skills.filter((_, i) => i !== index)
                      updateResume({
                        data: {
                          ...resume.data,
                          skills: newSkills,
                        },
                      })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Projects</h3>
                <Button onClick={addProject} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Project
                </Button>
              </div>
              {resume.data.projects.map((project, index) => (
                <div key={project.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Project {index + 1}</h3>
                    <Button variant="destructive" size="sm" onClick={() => deleteProject(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor={`projectName-${index}`}>Project Name</Label>
                    <Input
                      id={`projectName-${index}`}
                      placeholder="E-commerce Platform"
                      value={project.name}
                      onChange={(e) => updateProject(index, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`projectDescription-${index}`}>Description</Label>
                    <Textarea
                      id={`projectDescription-${index}`}
                      placeholder="Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented payment processing and inventory management."
                      value={project.description}
                      onChange={(e) => updateProject(index, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`projectLink-${index}`}>Link (URL)</Label>
                    <Input
                      id={`projectLink-${index}`}
                      placeholder="https://github.com/username/project or https://project-demo.com"
                      value={project.link}
                      onChange={(e) => updateProject(index, "link", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
