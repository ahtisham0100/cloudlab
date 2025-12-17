import { aiRules } from "@/lib/aiRules"

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json()

    let result

    switch (type) {
      case "summary":
        result = aiRules.generateSummary(data)
        break
      case "skills":
        result = aiRules.suggestSkills(data.role)
        break
      case "bullet":
        result = aiRules.generateBullet(data)
        break
      case "ats":
        result = aiRules.calculateAtsScore(data.resume)
        break
      default:
        return Response.json({ error: "Invalid suggestion type" }, { status: 400 })
    }

    return Response.json({ result }, { status: 200 })
  } catch (error) {
    console.error("AI suggestion error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
