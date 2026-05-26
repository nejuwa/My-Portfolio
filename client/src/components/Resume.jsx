export default function Resume({ resume }) {
  return (
    <section id="resume" className="resume section">
      <div className="container section-title">
        <h2>Resume</h2>
        <p>{resume.intro}</p>
      </div>

      <div className="container resume-grid">
        <div className="resume-col">
          <h3>Summary</h3>
          <div className="resume-item">
            <h4>{resume.summary.title}</h4>
            <p><em>{resume.summary.description}</em></p>
            <ul>
              {resume.summary.contact.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          <h3>Education</h3>
          {resume.education.map((edu) => (
            <div key={edu.degree} className="resume-item">
              <h4>{edu.degree}</h4>
              <h5>{edu.school} · {edu.period}</h5>
              <p><em>{edu.focus}</em></p>
              <p>{edu.description}</p>
            </div>
          ))}
        </div>

        <div className="resume-col">
          <h3>Professional Experience</h3>
          {resume.experience.map((exp) => (
            <div key={exp.title} className="resume-item">
              <h4>{exp.title}</h4>
              <h5>{exp.period}</h5>
              <p><em>{exp.location}</em></p>
              <ul>
                {exp.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
