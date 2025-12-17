interface ResumeData {
  data: {
    personalInfo: any
    education: any[]
    experience: any[]
    skills: string[]
    projects: any[]
  }
}

export function ProfessionalTemplate({ data }: ResumeData) {
  return (
    <div className="p-10 bg-white text-gray-900 font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-4 border-gray-400 pb-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{data.personalInfo.name}</h1>
        <div className="flex gap-4 text-xs text-gray-600 mt-2">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>|</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>|</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 mb-3">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 mb-4">Professional Experience</h2>
          <div className="space-y-5">
            {data.experience.map((exp: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm">{exp.position}</h3>
                  <span className="text-xs text-gray-600">
                    {exp.startDate &&
                      new Date(exp.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    {exp.endDate &&
                      ` - ${
                        exp.current
                          ? "Present"
                          : new Date(exp.endDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })
                      }`}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{exp.company}</p>
                {exp.description && <p className="text-xs text-gray-700 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 mb-4">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm">
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </h3>
                  <span className="text-xs text-gray-600">{edu.startDate?.split("-")[0]}</span>
                </div>
                <p className="text-xs text-gray-600">{edu.school}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 mb-3">Core Competencies</h2>
          <div className="text-sm text-gray-700">{data.skills.join(" • ")}</div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 mb-4">Projects</h2>
          <div className="space-y-3">
            {data.projects.map((proj: any, idx: number) => (
              <div key={idx}>
                <h3 className="font-bold text-sm">{proj.name}</h3>
                {proj.description && <p className="text-xs text-gray-700">{proj.description}</p>}
                {proj.link && <p className="text-xs text-blue-600 underline">{proj.link}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
