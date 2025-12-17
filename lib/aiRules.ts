export const aiRules = {
  // Professional summary generator
  generateSummary(data: {
    role: string
    yearsExperience: number
    skills: string[]
  }): string {
    const templates = [
      `Results-driven ${data.role} with ${data.yearsExperience}+ years of experience in ${data.skills[0] || "development"}. Proven track record of delivering high-quality solutions and leading cross-functional teams.`,
      `Passionate ${data.role} with ${data.yearsExperience} years of expertise in ${data.skills.slice(0, 2).join(" and ")}. Dedicated to creating innovative solutions and optimizing processes.`,
      `Strategic ${data.role} with ${data.yearsExperience}+ years driving business growth through ${data.skills[0] || "technology"}. Strong communicator with proven ability to manage complex projects.`,
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  },

  // Skill suggestions based on role
  suggestSkills(role: string): string[] {
    const skillMap: Record<string, string[]> = {
      "Software Engineer": ["JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git", "REST APIs", "Testing"],
      "Product Manager": [
        "Product Strategy",
        "User Research",
        "Data Analysis",
        "Roadmap Planning",
        "Stakeholder Management",
        "A/B Testing",
        "Agile",
      ],
      Designer: [
        "Figma",
        "UI/UX Design",
        "Prototyping",
        "User Research",
        "Wireframing",
        "Design Systems",
        "Accessibility",
      ],
      "Data Analyst": ["SQL", "Python", "Tableau", "Excel", "Data Visualization", "Statistics", "Power BI"],
    }
    return skillMap[role] || []
  },

  // Experience bullet generator
  generateBullet(data: {
    task: string
    impact: string
    tech?: string
  }): string {
    const verbs = [
      "Spearheaded",
      "Developed",
      "Implemented",
      "Led",
      "Designed",
      "Optimized",
      "Streamlined",
      "Architected",
    ]
    const verb = verbs[Math.floor(Math.random() * verbs.length)]
    const tech = data.tech ? ` using ${data.tech}` : ""
    return `${verb} ${data.task}, resulting in ${data.impact}${tech}.`
  },

  // ATS score calculator
  calculateAtsScore(resume: any): {
    score: number
    suggestions: string[]
  } {
    const suggestions: string[] = []
    let score = 50

    // Check for action verbs
    const actionVerbs = ["managed", "developed", "led", "designed", "implemented", "improved", "optimized", "created"]
    const experienceText = resume.experience
      ?.map((e: any) => e.description)
      .join(" ")
      .toLowerCase()

    const hasActionVerbs = actionVerbs.some((verb) => experienceText?.includes(verb))

    if (hasActionVerbs) {
      score += 15
    } else {
      suggestions.push("Add action verbs to your experience descriptions")
    }

    // Check for skills
    if (resume.skills && resume.skills.length > 5) {
      score += 10
    } else {
      suggestions.push("Add more relevant skills (aim for at least 5-10 keywords)")
    }

    // Check for quantifiable results
    const metricsText = (resume.experience?.map((e: any) => e.description).join(" ") || "").toLowerCase()
    const hasMetrics = /\d+%|\$\d+|improved|increased|reduced|saved/i.test(metricsText)

    if (hasMetrics) {
      score += 15
    } else {
      suggestions.push("Add quantifiable results and metrics to your bullets")
    }

    // Check for keywords
    if (resume.personalInfo?.summary) {
      score += 10
    } else {
      suggestions.push("Add a professional summary")
    }

    return { score: Math.min(score, 100), suggestions }
  },
}
