import { getResumesCollection } from "@/lib/mongodb"
import crypto from "crypto"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resumes = await getResumesCollection()
    const original = await resumes.findOne({ _id: id })

    if (!original) {
      return Response.json({ error: "Resume not found" }, { status: 404 })
    }

    const duplicated = {
      ...original,
      _id: crypto.randomUUID(),
      title: `${original.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await resumes.insertOne(duplicated)

    const response = {
      ...duplicated,
      id: duplicated._id,
      _id: undefined,
    }

    return Response.json(response, { status: 201 })
  } catch (error) {
    console.error("Error duplicating resume:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
