import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function seedFromJson(db) {
  const seedPath = path.join(__dirname, '../../data/portfolio.json');
  const data = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  const {
    profile,
    skills,
    skillsIntro,
    resume,
    projects,
    portfolioIntro,
    services,
    githubProjects = [],
  } = data;

  const insertProfile = db.prepare(`
    INSERT INTO profile (
      id, name, student_id, section, title, about, role, subtitle,
      birthday, age, phone, email, city, address, tagline, images, social,
      skills_intro, portfolio_intro
    ) VALUES (1, @name, @studentId, @section, @title, @about, @role, @subtitle,
      @birthday, @age, @phone, @email, @city, @address, @tagline, @images, @social,
      @skillsIntro, @portfolioIntro)
  `);

  insertProfile.run({
    name: profile.name,
    studentId: profile.studentId ?? null,
    section: profile.section ?? null,
    title: profile.title,
    about: profile.about,
    role: profile.role,
    subtitle: profile.subtitle,
    birthday: profile.birthday,
    age: profile.age,
    phone: profile.phone,
    email: profile.email,
    city: profile.city,
    address: profile.address,
    tagline: JSON.stringify(profile.tagline),
    images: JSON.stringify(profile.images),
    social: JSON.stringify(profile.social),
    skillsIntro: skillsIntro ?? null,
    portfolioIntro: portfolioIntro ?? null,
  });

  const insertSkill = db.prepare(
    'INSERT INTO skills (name, level, sort_order) VALUES (@name, @level, @sortOrder)'
  );
  skills.forEach((skill, i) => {
    insertSkill.run({ name: skill.name, level: skill.level, sortOrder: i });
  });

  const insertProject = db.prepare(`
    INSERT INTO projects (id, title, description, image, category, demo_url, tags, sort_order)
    VALUES (@id, @title, @description, @image, @category, @demoUrl, @tags, @sortOrder)
  `);
  projects.forEach((project, i) => {
    insertProject.run({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      demoUrl: project.demoUrl ?? null,
      tags: JSON.stringify(project.tags),
      sortOrder: i,
    });
  });

  const insertService = db.prepare(`
    INSERT INTO services (icon, title, description, sort_order)
    VALUES (@icon, @title, @description, @sortOrder)
  `);
  services.forEach((service, i) => {
    insertService.run({
      icon: service.icon,
      title: service.title,
      description: service.description,
      sortOrder: i,
    });
  });

  const insertGithub = db.prepare(`
    INSERT INTO github_projects (title, url, description, sort_order)
    VALUES (@title, @url, @description, @sortOrder)
  `);
  githubProjects.forEach((item, i) => {
    insertGithub.run({
      title: item.title,
      url: item.url,
      description: item.description ?? null,
      sortOrder: i,
    });
  });

  db.prepare('INSERT INTO resume_meta (id, intro) VALUES (1, @intro)').run({
    intro: resume.intro,
  });

  db.prepare(`
    INSERT INTO resume_summary (id, title, description, contact)
    VALUES (1, @title, @description, @contact)
  `).run({
    title: resume.summary.title,
    description: resume.summary.description,
    contact: JSON.stringify(resume.summary.contact),
  });

  const insertEducation = db.prepare(`
    INSERT INTO resume_education (degree, school, period, focus, description, sort_order)
    VALUES (@degree, @school, @period, @focus, @description, @sortOrder)
  `);
  resume.education.forEach((edu, i) => {
    insertEducation.run({
      degree: edu.degree,
      school: edu.school,
      period: edu.period,
      focus: edu.focus ?? null,
      description: edu.description ?? null,
      sortOrder: i,
    });
  });

  const insertExperience = db.prepare(`
    INSERT INTO resume_experience (title, period, location, highlights, sort_order)
    VALUES (@title, @period, @location, @highlights, @sortOrder)
  `);
  resume.experience.forEach((exp, i) => {
    insertExperience.run({
      title: exp.title,
      period: exp.period,
      location: exp.location,
      highlights: JSON.stringify(exp.highlights),
      sortOrder: i,
    });
  });
}

export function importMessagesFromJson(db) {
  const messagesPath = path.join(__dirname, '../../data/messages.json');
  if (!fs.existsSync(messagesPath)) return 0;

  const existing = db.prepare('SELECT COUNT(*) AS count FROM messages').get().count;
  if (existing > 0) return 0;

  let messages = [];
  try {
    messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
  } catch {
    return 0;
  }

  if (!Array.isArray(messages) || messages.length === 0) return 0;

  const insert = db.prepare(`
    INSERT INTO messages (name, email, subject, message, created_at)
    VALUES (@name, @email, @subject, @message, @createdAt)
  `);

  for (const row of messages) {
    insert.run({
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      createdAt: row.createdAt ?? new Date().toISOString(),
    });
  }
  return messages.length;
}
