import { getResumesCollection } from "@/lib/mongodb"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { section, content } = await request.json()

    const resumes = await getResumesCollection()
    const resume = await resumes.findOne({ _id: id })

    if (!resume) {
      return Response.json({ error: "Resume not found" }, { status: 404 })
    }

    // Rule-based AI suggestions without external API
    let suggestions: string[] = []

    if (section === "summary" && content) {
      suggestions = [
        `Expand your summary to highlight key achievements and years of experience`,
        `Add specific metrics or results from your background`,
        `Consider mentioning technologies or methodologies you specialize in`,
      ]
    } else if (section === "experience" && content) {
      suggestions = [
        `Use action verbs like "Led", "Developed", "Implemented" instead of "Worked on"`,
        `Quantify your achievements with numbers or percentages when possible`,
        `Focus on business impact rather than just responsibilities`,
        `Add specific technologies or tools you used`,
      ]
    } else if (section === "education" && content) {
      suggestions = [
        `Include relevant coursework or certifications if space allows`,
        `Add GPA if it's above 3.5`,
        `Mention academic honors or scholarships`,
      ]
    } else if (section === "skills") {
      suggestions = [
        `Prioritize skills most relevant to your target position`,
        `Group related skills together for better readability`,
        `Include both technical and soft skills`,
        `Consider adding proficiency levels (Beginner, Intermediate, Expert)`,
      ]
    }

    return Response.json({ suggestions }, { status: 200 })
  } catch (error) {
    console.error("Error getting suggestions:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
