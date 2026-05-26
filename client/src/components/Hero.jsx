import { useEffect, useState } from 'react';

export default function Hero({ profile }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const [deleting, setDeleting] = useState(false);
  const words = profile.tagline;

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          const next = current.slice(0, display.length + 1);
          setDisplay(next);
          if (next === current) setTimeout(() => setDeleting(true), 1500);
        } else {
          const next = current.slice(0, display.length - 1);
          setDisplay(next);
          if (next === '') {
            setDeleting(false);
            setWordIndex((i) => (i + 1) % words.length);
          }
        }
      },
      deleting ? 50 : 100
    );
    return () => clearTimeout(timeout);
  }, [display, deleting, wordIndex, words]);

  return (
    <section id="hero" className="hero section dark-background">
      <img src={profile.images.hero} alt="" className="hero-bg" />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <h2>{profile.name}</h2>
        <p>
          I&apos;m <span className="typed">{display}</span>
          <span className="typed-cursor">|</span>
        </p>
      </div>
    </section>
  );
}
