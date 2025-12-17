import { verifyUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 })
    }

    const result = await verifyUser(email, password)

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 401 })
    }

    return Response.json({ userId: result.userId }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
