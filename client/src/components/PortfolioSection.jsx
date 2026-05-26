import { useState } from 'react';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web' },
];

export default function PortfolioSection({ projects, githubProjects = [], intro }) {
  const [filter, setFilter] = useState('all');
  const filtered =
    filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="portfolio section light-background">
      <div className="container section-title">
        <h2>Portfolio</h2>
        <p>{intro || 'Some of my HTML, CSS, and full-stack projects.'}</p>
      </div>

      <div className="container">
        <ul className="portfolio-filters">
          {FILTERS.map(({ key, label }) => (
            <li key={key}>
              <button
                type="button"
                className={filter === key ? 'active' : ''}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="portfolio-grid">
          {filtered.map((project) => (
            <article key={project.id} className="portfolio-item">
              <div className="portfolio-content">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="portfolio-info">
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  <div className="portfolio-links">
                    <a href={project.image} target="_blank" rel="noreferrer" title="Preview">
                      🔍
                    </a>
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noreferrer" title="Live demo">
                        ↗
                      </a>
                    )}
                  </div>
                  <div className="portfolio-tags">
                    {project.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}

          {githubProjects.map((item) => (
            <article key={item.url} className="portfolio-item portfolio-item--github">
              <div className="portfolio-content">
                <div className="github-card-badge" aria-hidden="true">
                  GH
                </div>
                <div className="portfolio-info portfolio-info--always">
                  <h4>{item.title}</h4>
                  <p>{item.description || 'View project on GitHub'}</p>
                  <div className="portfolio-links">
                    <a href={item.url} target="_blank" rel="noreferrer" title="GitHub repository">
                      ↗
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
