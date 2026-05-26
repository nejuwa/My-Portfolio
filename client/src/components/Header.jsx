const NAV = [
  { id: 'hero', label: 'Home', icon: '⌂' },
  { id: 'about', label: 'About', icon: '◎' },
  { id: 'skills', label: 'Skills', icon: '◈' },
  { id: 'resume', label: 'Resume', icon: '▤' },
  { id: 'portfolio', label: 'Portfolio', icon: '▦' },
  { id: 'services', label: 'Services', icon: '⬡' },
  { id: 'contact', label: 'Contact', icon: '✉' },
];

export default function Header({ profile, activeSection, menuOpen, onToggleMenu, onNavClick }) {
  return (
    <header className={`header ${menuOpen ? 'header--open' : ''}`}>
      <button type="button" className="header-toggle" onClick={onToggleMenu} aria-label="Toggle menu">
        ☰
      </button>

      <div className="profile-img">
        <img src={profile.images.profile} alt={profile.name} />
      </div>

      <a href="#hero" className="logo" onClick={onNavClick}>
        <h1>{profile.name}</h1>
      </a>

      <div className="social-links">
        <a href={profile.social.telegram} target="_blank" rel="noreferrer" aria-label="Telegram">
          TG
        </a>
        <a href={profile.social.github} target="_blank" rel="noreferrer" aria-label="GitHub">
          GH
        </a>
        <a href={profile.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          in
        </a>
      </div>

      <nav className="navmenu">
        <ul>
          {NAV.map(({ id, label, icon }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeSection === id ? 'active' : ''}
                onClick={onNavClick}
              >
                <span className="nav-icon">{icon}</span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
