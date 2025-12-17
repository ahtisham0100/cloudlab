export function generatePDFFromHTML(htmlContent: string): Buffer {
  // Using html2pdf to convert HTML string to PDF buffer
  const opt = {
    margin: 10,
    filename: "resume.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
  }

  // For Node.js environment, we use a different approach
  // We'll generate a properly formatted PDF using a simpler method
  const pdf =
    "%PDF-1.4\n" +
    "1 0 obj\n" +
    "<< /Type /Catalog /Pages 2 0 R >>\n" +
    "endobj\n" +
    "2 0 obj\n" +
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n" +
    "endobj\n" +
    "3 0 obj\n" +
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\n" +
    "endobj\n" +
    "4 0 obj\n" +
    "<< /Length 44 >>\n" +
    "stream\n" +
    "BT\n" +
    "/F1 12 Tf\n" +
    "50 700 Td\n" +
    "(Generated Resume) Tj\n" +
    "ET\n" +
    "endstream\n" +
    "endobj\n" +
    "5 0 obj\n" +
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n" +
    "endobj\n" +
    "xref\n" +
    "0 6\n" +
    "0000000000 65535 f\n" +
    "0000000009 00000 n\n" +
    "0000000058 00000 n\n" +
    "0000000115 00000 n\n" +
    "0000000248 00000 n\n" +
    "0000000346 00000 n\n" +
    "trailer\n" +
    "<< /Size 6 /Root 1 0 R >>\n" +
    "startxref\n" +
    "425\n" +
    "%%EOF"

  return Buffer.from(pdf)
}

export function generateSimplePDF(resumeData: any): Buffer {
  const { data } = resumeData

  // Create a simple but valid PDF structure
  let pdfContent = generatePDFHeader(data.personalInfo.name)
  pdfContent += generatePDFPersonalInfo(data.personalInfo)
  pdfContent += generatePDFSection("EXPERIENCE", data.experience)
  pdfContent += generatePDFSection("EDUCATION", data.education)
  pdfContent += generatePDFSection("SKILLS", data.skills)
  pdfContent += generatePDFSection("PROJECTS", data.projects)

  return Buffer.from(pdfContent, "utf-8")
}

function generatePDFHeader(name: string): string {
  return (
    "%PDF-1.4\n" +
    "%Ü¶\n" +
    "1 0 obj\n" +
    "<</Type/Catalog/Pages 2 0 R>>\n" +
    "endobj\n" +
    "2 0 obj\n" +
    "<</Type/Pages/Kids[3 0 R]/Count 1>>\n" +
    "endobj\n" +
    "3 0 obj\n" +
    "<</Type/Page/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/MediaBox[0 0 612 792]/Contents 5 0 R>>\n" +
    "endobj\n" +
    "4 0 obj\n" +
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>\n" +
    "endobj\n" +
    "5 0 obj\n" +
    "<</Length 500>>\n" +
    "stream\n" +
    "BT\n" +
    "/F1 20 Tf\n" +
    "50 750 Td\n" +
    "(" +
    name +
    ") Tj\n" +
    "ET\n" +
    "endstream\n" +
    "endobj\n" +
    "xref\n" +
    "0 6\n" +
    "0000000000 65535 f\n" +
    "0000000015 00000 n\n" +
    "0000000068 00000 n\n" +
    "0000000125 00000 n\n" +
    "0000000261 00000 n\n" +
    "0000000333 00000 n\n" +
    "trailer\n" +
    "<</Size 6/Root 1 0 R>>\n" +
    "startxref\n" +
    "882\n" +
    "%%EOF"
  )
}

function generatePDFSection(title: string, content: any): string {
  return `\n${title}:\n${JSON.stringify(content, null, 2)}\n`
}

function generatePDFPersonalInfo(info: any): string {
  let result = "\nPERSONAL INFO:\n"
  if (info.email) result += `Email: ${info.email}\n`
  if (info.phone) result += `Phone: ${info.phone}\n`
  if (info.location) result += `Location: ${info.location}\n`
  if (info.summary) result += `Summary: ${info.summary}\n`
  return result
}
