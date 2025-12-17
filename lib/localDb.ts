import fs from "fs"
import path from "path"

const dbPath = path.join(process.cwd(), "data", "local.json")

interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: string
}

interface Resume {
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
  createdAt: string
  updatedAt: string
}

interface Database {
  users: User[]
  resumes: Resume[]
}

function readDb(): Database {
  try {
    const data = fs.readFileSync(dbPath, "utf-8")
    return JSON.parse(data)
  } catch {
    return { users: [], resumes: [] }
  }
}

function writeDb(data: Database): void {
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

export const localDb = {
  // User operations
  getUsers(): User[] {
    return readDb().users
  },

  getUserByEmail(email: string): User | undefined {
    return readDb().users.find((u) => u.email === email)
  },

  getUserById(id: string): User | undefined {
    return readDb().users.find((u) => u.id === id)
  },

  saveUser(user: User): void {
    const db = readDb()
    db.users.push(user)
    writeDb(db)
  },

  updateUser(id: string, updates: Partial<User>): void {
    const db = readDb()
    const user = db.users.find((u) => u.id === id)
    if (user) {
      Object.assign(user, updates)
      writeDb(db)
    }
  },

  deleteUser(id: string): void {
    const db = readDb()
    db.users = db.users.filter((u) => u.id !== id)
    db.resumes = db.resumes.filter((r) => r.userId !== id)
    writeDb(db)
  },

  // Resume operations
  getResumesByUser(userId: string): Resume[] {
    return readDb().resumes.filter((r) => r.userId === userId)
  },

  getResume(id: string): Resume | undefined {
    return readDb().resumes.find((r) => r.id === id)
  },

  saveResume(resume: Resume): void {
    const db = readDb()
    db.resumes.push(resume)
    writeDb(db)
  },

  updateResume(id: string, updates: Partial<Resume>): void {
    const db = readDb()
    const resume = db.resumes.find((r) => r.id === id)
    if (resume) {
      Object.assign(resume, { ...updates, updatedAt: new Date().toISOString() })
      writeDb(db)
    }
  },

  deleteResume(id: string): void {
    const db = readDb()
    db.resumes = db.resumes.filter((r) => r.id !== id)
    writeDb(db)
  },
}
