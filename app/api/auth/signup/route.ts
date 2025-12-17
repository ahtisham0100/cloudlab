import { createUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 })
    }

    const result = await createUser(email, password, name)

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 400 })
    }

    return Response.json({ userId: result.userId }, { status: 200 })
  } catch (error) {
    console.error("Signup error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
