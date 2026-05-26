import { useState } from 'react';
import { sendContact } from '../api';

const INITIAL = { name: '', email: '', subject: '', message: '' };

export default function Contact({ profile }) {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');
    try {
      const data = await sendContact(form);
      setStatus('success');
      setFeedback(data.message);
      setForm(INITIAL);
    } catch (err) {
      setStatus('error');
      setFeedback(err.message);
    }
  }

  return (
    <section id="contact" className="contact section">
      <div className="container section-title">
        <h2>Contact</h2>
        <p>You can reach me at:</p>
      </div>

      <div className="container contact-grid">
        <div className="info-wrap">
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <h3>Address</h3>
              <p>{profile.address}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📞</span>
            <div>
              <h3>Phone</h3>
              <p>{profile.phone}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">✉</span>
            <div>
              <h3>Email</h3>
              <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Your Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Your Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label>
            Subject
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              rows={8}
              value={form.message}
              onChange={handleChange}
              required
            />
          </label>

          {status === 'loading' && <p className="form-status loading">Sending…</p>}
          {status === 'success' && <p className="form-status success">{feedback}</p>}
          {status === 'error' && <p className="form-status error">{feedback}</p>}

          <button type="submit" disabled={status === 'loading'}>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
