interface ResumeData {
  data: {
    personalInfo: any
    education: any[]
    experience: any[]
    skills: string[]
    projects: any[]
  }
}

export function ModernTemplate({ data }: ResumeData) {
  return (
    <div className="p-12 bg-white text-gray-900 font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg mb-8">
        <h1 className="text-5xl font-bold mb-2">{data.personalInfo.name}</h1>
        <div className="flex gap-6 text-sm">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-8">
          {/* Experience */}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Experience</h2>
              <div className="space-y-6">
                {data.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-blue-600 pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg">{exp.position}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {exp.startDate && new Date(exp.startDate).getFullYear()}
                        {exp.endDate && ` - ${exp.current ? "Present" : new Date(exp.endDate).getFullYear()}`}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                    {exp.description && <p className="text-sm text-gray-700 mt-2">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-gray-600">{edu.school}</p>
                    <p className="text-xs text-gray-500">
                      {edu.startDate?.split("-")[0]}
                      {edu.endDate && ` - ${edu.endDate?.split("-")[0]}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Projects</h2>
              <div className="space-y-4">
                {data.projects.map((proj: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold">{proj.name}</h3>
                    {proj.description && <p className="text-sm text-gray-700">{proj.description}</p>}
                    {proj.link && <p className="text-xs text-blue-600 underline mt-1">{proj.link}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Skills */}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string, idx: number) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
