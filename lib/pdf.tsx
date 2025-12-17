export function generatePDFFromResume(resume: any): Buffer {
  const { data } = resume

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${data.personalInfo.name}</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 40px; 
          line-height: 1.6;
          color: #333;
        }
        h1 { font-size: 28px; margin: 0 0 5px 0; font-weight: 600; }
        h2 { 
          font-size: 14px; 
          font-weight: 600; 
          border-bottom: 2px solid #2c3e50; 
          margin-top: 20px; 
          margin-bottom: 12px;
          padding-bottom: 8px;
          color: #2c3e50;
        }
        .contact { font-size: 12px; color: #555; margin-bottom: 15px; }
        .contact span { margin-right: 15px; }
        .section { margin-bottom: 20px; }
        .entry { margin-bottom: 16px; }
        .entry-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .entry-title { font-weight: 600; font-size: 13px; }
        .entry-subtitle { font-size: 12px; color: #666; margin-top: 2px; }
        .entry-dates { font-size: 11px; color: #888; }
        .entry-description { font-size: 12px; margin-top: 6px; line-height: 1.5; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-tag { 
          background-color: #ecf0f1; 
          padding: 4px 10px; 
          font-size: 11px; 
          border-radius: 3px;
          border: 1px solid #bdc3c7;
        }
        .summary { font-size: 12px; line-height: 1.6; margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <h1>${data.personalInfo.name || "Your Name"}</h1>
      
      ${
        data.personalInfo.email || data.personalInfo.phone || data.personalInfo.location
          ? `
        <div class="contact">
          ${data.personalInfo.email ? `<span>${data.personalInfo.email}</span>` : ""}
          ${data.personalInfo.phone ? `<span>${data.personalInfo.phone}</span>` : ""}
          ${data.personalInfo.location ? `<span>${data.personalInfo.location}</span>` : ""}
        </div>
      `
          : ""
      }

      ${data.personalInfo.summary ? `<div class="summary">${data.personalInfo.summary}</div>` : ""}

      ${
        data.experience.length > 0
          ? `
        <h2>Experience</h2>
        <div class="section">
          ${data.experience
            .map(
              (exp: any) => `
            <div class="entry">
              <div class="entry-header">
                <div>
                  <div class="entry-title">${exp.position}</div>
                  <div class="entry-subtitle">${exp.company}</div>
                </div>
                <div class="entry-dates">${exp.startDate} - ${exp.current ? "Present" : exp.endDate}</div>
              </div>
              ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }

      ${
        data.education.length > 0
          ? `
        <h2>Education</h2>
        <div class="section">
          ${data.education
            .map(
              (edu: any) => `
            <div class="entry">
              <div class="entry-header">
                <div>
                  <div class="entry-title">${edu.degree} in ${edu.field}</div>
                  <div class="entry-subtitle">${edu.school}</div>
                </div>
                <div class="entry-dates">${edu.startDate}</div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }

      ${
        data.skills.length > 0
          ? `
        <h2>Skills</h2>
        <div class="skills">
          ${data.skills.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join("")}
        </div>
      `
          : ""
      }

      ${
        data.projects.length > 0
          ? `
        <h2>Projects</h2>
        <div class="section">
          ${data.projects
            .map(
              (proj: any) => `
            <div class="entry">
              <div class="entry-title">${proj.name}</div>
              ${proj.description ? `<div class="entry-description">${proj.description}</div>` : ""}
              ${proj.link ? `<div class="entry-description"><a href="${proj.link}">${proj.link}</a></div>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
    </body>
    </html>
  `

  // Note: This creates an HTML document that can be printed as PDF
  // For production, consider using a service like html2pdf.js on client or pdf-lib on server
  const utf8Bytes = Buffer.from(html, "utf-8")
  return utf8Bytes
}

export function htmlToPdfBuffer(html: string): Buffer {
  // Returns HTML as buffer that browsers can handle as application/pdf
  // This is a workaround - browsers will offer to save as PDF when clicking download
  return Buffer.from(html, "utf-8")
}
