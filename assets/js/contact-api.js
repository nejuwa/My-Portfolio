/**
 * Sends the static site contact form to the Node.js API (POST /api/contact).
 */
(function () {
  'use strict';

  const API_ORIGINS = [
    '', // same origin (e.g. production Express or proxied dev)
    'http://localhost:5000',
    'http://127.0.0.1:5000',
  ];

  function resolveApiUrl(path) {
    const configured = window.PORTFOLIO_API_URL;
    if (configured) {
      return `${configured.replace(/\/$/, '')}${path}`;
    }
    if (window.location.port === '5173' || window.location.port === '5000') {
      return path;
    }
    return `${API_ORIGINS.find((o) => o) || API_ORIGINS[1]}${path}`;
  }

  function displayError(form, message) {
    const loading = form.querySelector('.loading');
    const error = form.querySelector('.error-message');
    const sent = form.querySelector('.sent-message');
    if (loading) loading.classList.remove('d-block');
    if (sent) sent.classList.remove('d-block');
    if (error) {
      error.textContent =
        typeof message === 'string' ? message : message?.message || 'Failed to send message';
      error.classList.add('d-block');
    }
  }

  function displaySuccess(form) {
    const loading = form.querySelector('.loading');
    const error = form.querySelector('.error-message');
    const sent = form.querySelector('.sent-message');
    if (loading) loading.classList.remove('d-block');
    if (error) error.classList.remove('d-block');
    if (sent) sent.classList.add('d-block');
    form.reset();
  }

  async function submitContact(form) {
    const name = form.querySelector('[name="name"]')?.value?.trim();
    const email = form.querySelector('[name="email"]')?.value?.trim();
    const subject = form.querySelector('[name="subject"]')?.value?.trim();
    const message = form.querySelector('[name="message"]')?.value?.trim();

    if (!name || !email || !subject || !message) {
      displayError(form, 'Please fill in all fields.');
      return;
    }

    if (message.length < 10) {
      displayError(form, 'Message must be at least 10 characters.');
      return;
    }

    const loading = form.querySelector('.loading');
    const error = form.querySelector('.error-message');
    const sent = form.querySelector('.sent-message');
    if (loading) loading.classList.add('d-block');
    if (error) error.classList.remove('d-block');
    if (sent) sent.classList.remove('d-block');

    const payload = { name, email, subject, message };
    const urls = [
      resolveApiUrl('/api/contact'),
      'http://localhost:5000/api/contact',
      'http://127.0.0.1:5000/api/contact',
    ];
    const uniqueUrls = [...new Set(urls)];

    let lastError = null;

    for (const url of uniqueUrls) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });

        let data = {};
        try {
          data = await res.json();
        } catch {
          /* non-JSON body */
        }

        if (!res.ok) {
          const msg = data.errors?.[0]?.msg || data.message || `Server error (${res.status})`;
          throw new Error(msg);
        }

        displaySuccess(form);
        return;
      } catch (err) {
        lastError = err;
        if (err.message && !err.message.includes('fetch')) {
          displayError(form, err.message);
          return;
        }
      }
    }

    displayError(
      form,
      lastError?.message?.includes('fetch')
        ? 'Cannot reach the API. Run npm run dev from the project folder, then try again.'
        : lastError?.message || 'Failed to send message'
    );
  }

  document.querySelectorAll('form.contact-api-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitContact(form);
    });
  });
})();
