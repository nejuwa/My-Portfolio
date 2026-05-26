export function getPortfolio(db) {
  const profileRow = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  if (!profileRow) return null;

  const skills = db
    .prepare('SELECT name, level FROM skills ORDER BY sort_order ASC')
    .all();

  const projects = db
    .prepare(
      `SELECT id, title, description, image, category, demo_url AS demoUrl, tags
       FROM projects ORDER BY sort_order ASC`
    )
    .all()
    .map((p) => ({
      ...p,
      tags: JSON.parse(p.tags),
    }));

  const services = db
    .prepare('SELECT icon, title, description FROM services ORDER BY sort_order ASC')
    .all();

  const githubProjects = db
    .prepare(
      'SELECT title, url, description FROM github_projects ORDER BY sort_order ASC'
    )
    .all();

  const resumeIntro = db.prepare('SELECT intro FROM resume_meta WHERE id = 1').get();
  const resumeSummary = db.prepare('SELECT * FROM resume_summary WHERE id = 1').get();
  const education = db
    .prepare(
      `SELECT degree, school, period, focus, description
       FROM resume_education ORDER BY sort_order ASC`
    )
    .all();
  const experience = db
    .prepare(
      `SELECT title, period, location, highlights
       FROM resume_experience ORDER BY sort_order ASC`
    )
    .all()
    .map((row) => ({
      title: row.title,
      period: row.period,
      location: row.location,
      highlights: JSON.parse(row.highlights),
    }));

  return {
    profile: {
      name: profileRow.name,
      studentId: profileRow.student_id || undefined,
      section: profileRow.section || undefined,
      title: profileRow.title,
      tagline: JSON.parse(profileRow.tagline),
      about: profileRow.about,
      role: profileRow.role,
      subtitle: profileRow.subtitle,
      birthday: profileRow.birthday,
      age: profileRow.age,
      phone: profileRow.phone,
      email: profileRow.email,
      city: profileRow.city,
      address: profileRow.address,
      images: JSON.parse(profileRow.images),
      social: JSON.parse(profileRow.social),
    },
    skills,
    resume: {
      intro: resumeIntro.intro,
      summary: {
        title: resumeSummary.title,
        description: resumeSummary.description,
        contact: JSON.parse(resumeSummary.contact),
      },
      education,
      experience,
    },
    projects,
    githubProjects,
    services,
    skillsIntro: profileRow.skills_intro || undefined,
    portfolioIntro: profileRow.portfolio_intro || undefined,
  };
}
