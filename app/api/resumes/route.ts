import { getResumesCollection } from "@/lib/mongodb"
import crypto from "crypto"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 })
    }

    const resumes = await getResumesCollection()
    const userResumes = await resumes.find({ userId }).toArray()

    const transformedResumes = userResumes.map((resume) => ({
      ...resume,
      id: resume._id,
      _id: undefined,
    }))

    return Response.json({ resumes: transformedResumes }, { status: 200 })
  } catch (error) {
    console.error("Error fetching resumes:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, title, template } = await request.json()

    const resumeId = crypto.randomUUID()
    const newResume = {
      _id: resumeId,
      userId,
      title,
      template: template || "modern",
      data: {
        personalInfo: {
          name: "",
          email: "",
          phone: "",
          location: "",
          summary: "",
        },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        achievements: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const resumes = await getResumesCollection()
    await resumes.insertOne(newResume)

    const response = {
      ...newResume,
      id: newResume._id,
      _id: undefined,
    }

    return Response.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating resume:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
