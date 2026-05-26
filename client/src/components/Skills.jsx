export default function Skills({ skills, intro }) {
  const half = Math.ceil(skills.length / 2);
  const left = skills.slice(0, half);
  const right = skills.slice(half);

  return (
    <section id="skills" className="skills section light-background">
      <div className="container section-title">
        <h2>Skills</h2>
        <p>{intro || 'Technologies I work with and continue to improve.'}</p>
      </div>

      <div className="container skills-grid">
        <SkillColumn items={left} />
        <SkillColumn items={right} />
      </div>
    </section>
  );
}

function SkillColumn({ items }) {
  return (
    <div className="skills-col">
      {items.map((skill) => (
        <div key={skill.name} className="progress">
          <span className="skill">
            <span>{skill.name}</span>
            <i className="val">{skill.level}%</i>
          </span>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar"
              style={{ width: `${skill.level}%` }}
              role="progressbar"
              aria-valuenow={skill.level}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
