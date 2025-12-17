import { getResumesCollection } from "@/lib/mongodb"

function generateHTMLFromResume(resume: any): string {
  const { data } = resume

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${data.personalInfo.name || "Resume"}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333;
          background: white;
        }
        .container { max-width: 8.5in; height: 11in; margin: 0 auto; padding: 0.5in; }
        h1 { font-size: 28px; margin-bottom: 5px; font-weight: 700; }
        h2 { font-size: 14px; font-weight: 700; border-bottom: 2px solid #333; margin-top: 15px; margin-bottom: 10px; padding-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
        .contact { font-size: 11px; color: #666; margin-bottom: 15px; }
        .contact span { margin-right: 12px; }
        .section { margin-bottom: 15px; }
        .job, .education, .project { margin-bottom: 12px; }
        .job-title, .degree { font-weight: 700; font-size: 12px; }
        .company, .school { font-size: 11px; color: #666; }
        .dates { font-size: 10px; color: #999; float: right; }
        .description { font-size: 11px; margin-top: 4px; line-height: 1.5; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background-color: #f0f0f0; padding: 4px 8px; font-size: 10px; border-radius: 3px; }
        .summary { font-size: 11px; line-height: 1.5; margin-bottom: 10px; }
        ul { margin-left: 20px; font-size: 11px; }
        li { margin-bottom: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${data.personalInfo.name || "Your Name"}</h1>
        <div class="contact">
          ${data.personalInfo.email ? `<span>${data.personalInfo.email}</span>` : ""}
          ${data.personalInfo.phone ? `<span>|</span><span>${data.personalInfo.phone}</span>` : ""}
          ${data.personalInfo.location ? `<span>|</span><span>${data.personalInfo.location}</span>` : ""}
        </div>

        ${data.personalInfo.summary ? `<div class="summary">${data.personalInfo.summary}</div>` : ""}

        ${
          data.experience.length > 0
            ? `
          <h2>Professional Experience</h2>
          ${data.experience
            .map(
              (exp: any) => `
            <div class="job">
              <div>
                <span class="job-title">${exp.position || "Position"}</span>
                <span class="dates">${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}</span>
              </div>
              <div class="company">${exp.company || "Company Name"}</div>
              ${exp.description ? `<div class="description">${exp.description}</div>` : ""}
            </div>
          `,
            )
            .join("")}
        `
            : ""
        }

        ${
          data.education.length > 0
            ? `
          <h2>Education</h2>
          ${data.education
            .map(
              (edu: any) => `
            <div class="education">
              <div>
                <span class="degree">${edu.degree || "Degree"} in ${edu.field || "Field"}</span>
              </div>
              <div class="school">${edu.school || "School Name"}</div>
            </div>
          `,
            )
            .join("")}
        `
            : ""
        }

        ${
          data.skills.length > 0
            ? `
          <h2>Skills</h2>
          <div class="skills">
            ${data.skills.map((skill: string) => `<div class="skill">${skill}</div>`).join("")}
          </div>
        `
            : ""
        }

        ${
          data.projects.length > 0
            ? `
          <h2>Projects</h2>
          ${data.projects
            .map(
              (proj: any) => `
            <div class="project">
              <div class="job-title">${proj.name || "Project Name"}</div>
              ${proj.description ? `<div class="description">${proj.description}</div>` : ""}
              ${proj.link ? `<div class="description"><a href="${proj.link}">${proj.link}</a></div>` : ""}
            </div>
          `,
            )
            .join("")}
        `
            : ""
        }
      </div>
    </body>
    </html>
  `
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format")

    const resumes = await getResumesCollection()
    const resume = await resumes.findOne({ _id: id })

    if (!resume) {
      return Response.json({ error: "Resume not found" }, { status: 404 })
    }

    if (format === "json") {
      return Response.json(resume, { status: 200 })
    }

    if (format === "pdf" || format === "html") {
      const html = generateHTMLFromResume(resume)

      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="resume-${resume.title || "export"}.html"`,
        },
      })
    }

    return Response.json({ error: "Invalid format. Use 'json', 'pdf', or 'html'" }, { status: 400 })
  } catch (error) {
    console.error("Error exporting resume:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
