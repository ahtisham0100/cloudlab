interface ResumeData {
  data: {
    personalInfo: any
    education: any[]
    experience: any[]
    skills: string[]
    projects: any[]
  }
}

export function MinimalTemplate({ data }: ResumeData) {
  return (
    <div className="p-12 bg-white text-black font-serif max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-black pb-6 mb-6">
        <h1 className="text-4xl font-bold">{data.personalInfo.name}</h1>
        <div className="flex gap-4 text-sm mt-2 text-gray-700">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>•</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>•</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <p className="text-sm leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-black pb-2 mb-3">Experience</h2>
          {data.experience.map((exp: any, idx: number) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{exp.position}</h3>
                <span className="text-xs text-gray-600">
                  {exp.startDate && new Date(exp.startDate).getFullYear()}
                  {exp.endDate && ` - ${exp.current ? "Present" : new Date(exp.endDate).getFullYear()}`}
                </span>
              </div>
              <p className="text-sm text-gray-700">{exp.company}</p>
              {exp.description && <p className="text-xs mt-1 leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-black pb-2 mb-3">Education</h2>
          {data.education.map((edu: any, idx: number) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-xs text-gray-600">{edu.startDate?.split("-")[0]}</span>
              </div>
              <p className="text-sm text-gray-700">{edu.school}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-black pb-2 mb-3">Skills</h2>
          <p className="text-sm">{data.skills.join(" • ")}</p>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-black pb-2 mb-3">Projects</h2>
          {data.projects.map((proj: any, idx: number) => (
            <div key={idx} className="mb-3">
              <h3 className="font-bold">{proj.name}</h3>
              {proj.description && <p className="text-sm text-gray-700">{proj.description}</p>}
              {proj.link && <p className="text-xs text-blue-600 underline">{proj.link}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
