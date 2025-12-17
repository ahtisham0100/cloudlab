import { getUsersCollection } from "./mongodb"
import crypto from "crypto"
import bcrypt from "bcryptjs"

function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(
  email: string,
  password: string,
  name: string,
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    const users = await getUsersCollection()

    // Check if user exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return { success: false, error: "Email already exists" }
    }

    const userId = crypto.randomUUID()
    const passwordHash = await hashPassword(password)

    await users.insertOne({
      _id: userId,
      email,
      name,
      passwordHash,
      createdAt: new Date(),
    })

    return { success: true, userId }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function verifyUser(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    const users = await getUsersCollection()

    const user = await users.findOne({ email })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return { success: false, error: "Invalid password" }
    }

    return { success: true, userId: user._id }
  } catch (error) {
    console.error("Error verifying user:", error)
    return { success: false, error: "Verification failed" }
  }
}
