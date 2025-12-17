import { MongoClient, type Db, type Collection } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const mongoUrl = process.env.MONGODB_URI
  if (!mongoUrl) {
    throw new Error("MONGODB_URI is not defined in environment variables")
  }

  const client = new MongoClient(mongoUrl, {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })

  await client.connect()

  const db = client.db("resume_builder")
  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase()
  return db
}

export async function getUsersCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("users")
}

export async function getResumesCollection(): Promise<Collection> {
  const db = await getDatabase()
  const collection = db.collection("resumes")

  await collection.createIndex({ _id: 1 })
  await collection.createIndex({ userId: 1 })
  await collection.createIndex({ updatedAt: -1 })

  return collection
}

export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
  }
}
