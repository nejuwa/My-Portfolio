export default function Footer({ name }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer light-background">
      <div className="container">
        <p>
          © {year} <strong>{name}</strong>. All rights reserved.
        </p>
        <p className="credits">Full-stack portfolio · React & Node.js</p>
      </div>
    </footer>
  );
}
