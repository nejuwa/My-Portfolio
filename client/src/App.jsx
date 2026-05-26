import { useEffect, useState } from 'react';
import { fetchPortfolio } from './api';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Resume from './components/Resume';
import PortfolioSection from './components/PortfolioSection';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchPortfolio()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  if (error) {
    return (
      <div className="app-state app-state--error">
        <p>Could not load portfolio data</p>
        <code>{error}</code>
        <p className="hint">
          Open <strong>http://localhost:5173</strong> (not index.html) and run both servers:
        </p>
        <pre className="hint-code">npm run dev</pre>
        <p className="hint">API should respond at http://localhost:5000/api/health</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app-state">
        <div className="spinner" aria-label="Loading" />
        <p>Loading portfolio…</p>
      </div>
    );
  }

  const {
    profile,
    skills,
    skillsIntro,
    resume,
    projects,
    portfolioIntro,
    githubProjects,
    services,
  } = data;

  return (
    <>
      <Header
        profile={profile}
        activeSection={activeSection}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((o) => !o)}
        onNavClick={() => setMenuOpen(false)}
      />
      <main className="main">
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} intro={skillsIntro} />
        <Resume resume={resume} />
        <PortfolioSection
          projects={projects}
          githubProjects={githubProjects}
          intro={portfolioIntro}
        />
        <Services services={services} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile.name} />
      <a href="#hero" className="scroll-top" aria-label="Back to top">
        ↑
      </a>
    </>
  );
}
