const ICONS = {
  code: '</>',
  palette: '◐',
  server: '⬢',
  cpu: '⚙',
};

export default function Services({ services }) {
  return (
    <section id="services" className="services section">
      <div className="container section-title">
        <h2>Services</h2>
        <p>What I can help you build.</p>
      </div>

      <div className="container services-grid">
        {services.map((service) => (
          <div key={service.title} className="service-card">
            <div className="service-icon">{ICONS[service.icon] || '★'}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
