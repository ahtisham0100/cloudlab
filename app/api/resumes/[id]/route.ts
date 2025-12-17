import { getResumesCollection } from "@/lib/mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resumes = await getResumesCollection()

    const resume = await resumes.findOne({ _id: id })

    if (!resume) {
      return Response.json({ error: "Resume not found" }, { status: 404 })
    }

    const response = {
      ...resume,
      id: resume._id,
      _id: undefined,
    }

    return Response.json(response, { status: 200 })
  } catch (error) {
    console.error("[v0] Error fetching resume:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = await request.json()

    console.log("[v0] Updating resume:", id)

    const { _id, id: resumeId, ...dataToUpdate } = updates

    const resumes = await getResumesCollection()

    const result = await resumes.updateOne(
      { _id: id },
      {
        $set: {
          ...dataToUpdate,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      console.log("[v0] Resume not found:", id)
      return Response.json({ error: "Resume not found" }, { status: 404 })
    }

    console.log("[v0] Resume updated successfully:", id)

    const updatedResume = await resumes.findOne({ _id: id })

    const response = {
      ...updatedResume,
      id: updatedResume._id,
      _id: undefined,
    }

    return Response.json(response, { status: 200 })
  } catch (error) {
    console.error("[v0] Error updating resume:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resumes = await getResumesCollection()
    const result = await resumes.deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return Response.json({ error: "Resume not found" }, { status: 404 })
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting resume:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
