export default function About({ profile }) {
  return (
    <section id="about" className="about section">
      <div className="container section-title">
        <h2>About</h2>
        <p>{profile.about}</p>
      </div>

      <div className="container about-grid">
        <div className="about-photo">
          <img src={profile.images.hero} alt={profile.name} />
        </div>
        <div className="about-content">
          <h3>{profile.role}</h3>
          <p className="about-sub">{profile.subtitle}</p>
          <div className="about-facts">
            <ul>
              <li><strong>Birthday:</strong> {profile.birthday}</li>
              <li><strong>Phone:</strong> {profile.phone}</li>
              <li><strong>City:</strong> {profile.city}</li>
            </ul>
            <ul>
              <li><strong>Age:</strong> {profile.age}</li>
              <li><strong>Email:</strong> <a href={`mailto:${profile.email}`}>{profile.email}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
