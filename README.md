# iPortfolio

**Full-stack personal portfolio** — React, Node.js, Express, and SQLite.

Built for **Nejat Mussa** · Software Engineering @ ASTU · UGR/35172/16

---

## About

Modern portfolio web app with a REST API and SQLite database. It includes your profile, skills, resume, project gallery, services, and a contact form that saves messages to the database.

The original Bootstrap template (`index.html`) remains in the repo; the React app is the main experience and reuses images from `assets/img/`.

---

## Features

- **Single-page React UI** — Hero, About, Skills, Resume, Portfolio, Services, Contact
- **REST API** — Portfolio data and contact submissions
- **SQLite database** — No separate DB server; auto-seeds on first run
- **Typed hero** — Rotating roles (Designer, Developer, Competitive Programmer)
- **Project filters** — Browse web projects with live demo links
- **Responsive layout** — Sidebar navigation inspired by the iPortfolio template
- **Production-ready** — One command builds the client and serves it from Express

---

## Tech stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 19, Vite                      |
| Backend    | Node.js, Express                    |
| Database   | SQLite (`node:sqlite`, Node 22.5+) |
| Styling    | Custom CSS (iPortfolio color theme) |
| Tooling    | Concurrently, express-validator     |

---

## Prerequisites

- **Node.js 22.5 or newer** (required for built-in SQLite)
- **npm** (comes with Node.js)

Check your version:

```bash
node -v
```

---

## Quick start

### 1. Clone and install

```bash
cd iPortfolio
npm run install:all
```

### 2. Run development servers

```bash
npm run dev
```

This starts **both** the API and the React app.

| Service   | URL                          |
| --------- | ---------------------------- |
| React app | http://localhost:5173        |
| API       | http://localhost:5000/api    |
| Health    | http://localhost:5000/api/health |

> **Important:** Open **http://localhost:5173** — not `index.html` in the browser. The static HTML file does not use the API.

### 3. Verify the backend

Visit http://localhost:5000/api/health — you should see `"ok": true` and database stats.

---

## Project structure

```
iPortfolio/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Header, Hero, About, Skills, etc.
│   │   ├── api.js          # API client
│   │   └── styles/
│   └── vite.config.js      # Proxies /api → port 5000
│
├── server/                 # Express backend
│   ├── data/
│   │   ├── portfolio.json  # Seed data (edit & re-seed)
│   │   └── portfolio.db    # SQLite DB (created automatically)
│   └── src/
│       ├── db/             # Schema, seed, queries
│       ├── routes/api.js
│       └── index.js
│
├── assets/                 # Images, CSS (original template)
├── index.html              # Legacy static portfolio
└── package.json            # Root scripts (dev, build, seed)
```

---

## Available scripts

Run from the **project root**:

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run install:all`| Install root, server, and client dependencies    |
| `npm run dev`        | Start API + React (recommended)                  |
| `npm run dev:server` | API only (port 5000)                             |
| `npm run dev:client` | React only (port 5173)                           |
| `npm run build`      | Build React for production                       |
| `npm run start`      | Serve production build + API (port 5000)         |
| `npm run db:seed`    | Reset database from `portfolio.json`             |

---

## API reference

### `GET /api/health`

Health check and database statistics.

```json
{
  "ok": true,
  "database": {
    "engine": "sqlite",
    "path": ".../server/data/portfolio.db",
    "skills": 8,
    "projects": 3,
    "services": 4,
    "messages": 0
  }
}
```

### `GET /api/portfolio`

Returns profile, skills, resume, projects, and services.

### `POST /api/contact`

Submit the contact form.

**Body (JSON):**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Hello",
  "message": "Your message here (min 10 characters)"
}
```

**Success (201):**

```json
{
  "success": true,
  "message": "Your message has been sent. Thank you!"
}
```

### `GET /api/messages`

Lists contact messages. **Development only** (`NODE_ENV=development`).

---

## Database

SQLite file: `server/data/portfolio.db`

| Table               | Purpose                    |
| ------------------- | -------------------------- |
| `profile`           | Name, bio, contact, social |
| `skills`            | Skill name and level (%)   |
| `projects`          | Portfolio projects         |
| `services`          | Offered services           |
| `resume_*`          | Education & experience     |
| `messages`          | Contact form submissions   |

### Update your content

You have **two portfolio pages** — they do not sync automatically:

| File / URL | What it is |
| ---------- | ---------- |
| `index.html` | Static site (your Bootstrap template) — edit this file directly |
| http://localhost:5173 | React app — reads from **database** / `portfolio.json` |

**After editing `index.html`**, copy your changes into `server/data/portfolio.json`, then run:

```bash
npm run db:seed
```

Refresh http://localhost:5173 to see updates on the React app.

**Option A — Edit JSON and re-seed (for React app)**

1. Edit `server/data/portfolio.json`
2. Run `npm run db:seed`

**Option B — Edit the database directly**

Use [DB Browser for SQLite](https://sqlitebrowser.org/) or any SQLite client on `server/data/portfolio.db`.

On first run, the server creates the database and imports data from `portfolio.json` automatically.

---

## Environment variables

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_PATH=data/portfolio.db
```

| Variable         | Default                      | Description              |
| ---------------- | ---------------------------- | ------------------------ |
| `PORT`           | `5000`                       | API server port          |
| `CLIENT_URL`     | `http://localhost:5173`      | Allowed CORS origin      |
| `DATABASE_PATH`  | `data/portfolio.db`          | Path to SQLite file      |

Paths are relative to the `server/` folder.

---

## Production

```bash
npm run build
npm run start
```

Open http://localhost:5000 — Express serves the React build and the API on the same port.

Set `NODE_ENV=production` (handled automatically by `npm run start`).

---

## Troubleshooting

### “Could not load portfolio” / data fetching error

1. Run **`npm run dev` from the project root** (not only the client).
2. Open **http://localhost:5173**, not `index.html`.
3. Check http://localhost:5000/api/health — if it fails, the API is not running.
4. Ensure Node.js is **22.5+**: `node -v`
5. Reinstall and re-seed if needed:

```bash
npm run install:all
npm run db:seed
npm run dev
```

### Port already in use

Stop other processes on port 5000 or 5173, then run `npm run dev` again.

### Database locked during `db:seed`

Stop the dev server (Ctrl+C), then run `npm run db:seed`.

---

## Author

**Nejat Mussa**

- Student ID: UGR/35172/16 · Section 1, 1  
- Adama Science and Technology University (ASTU)  
- Email: nejatmussa605@gmail.com  

**Links**

- GitHub: [nejuwa](https://github.com/nejuwa)
- LinkedIn: [Nejat Mussa](https://www.linkedin.com/in/nejat-mussa-482b23372/)
- Telegram: [@haysemm](http://t.me/haysemm)

---

## Credits

- UI inspired by the [iPortfolio](https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/) Bootstrap template
- Full-stack implementation: React + Express + SQLite

---

## License

This project is for personal and educational use. Original template assets may be subject to the BootstrapMade license.
