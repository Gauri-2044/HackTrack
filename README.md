<p align="center">
  <a href="https://hacktrack-six.vercel.app">
    <img src="client/public/logo.png" alt="HackTrack logo" width="480" />
  </a>
</p>

<h1 align="center">HackTrack</h1>
<p align="center"><strong>Track. Collaborate. Win Hackathons Together.</strong></p>
<p align="center">A shared workspace for managing hackathons, teams, tasks, milestones, and submission resources.</p>

<p align="center">
  <a href="https://hacktrack-six.vercel.app"><strong>Open the App</strong></a> &middot;
  <a href="https://hacktrack-six.vercel.app/register">Create a Team</a> &middot;
  <a href="https://github.com/Gauri-2044/HackTrack/issues">Report an Issue</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/Hosted_on-Vercel-000000?logo=vercel&logoColor=white" alt="Hosted on Vercel" />
</p>

## Overview

Hackathon work often gets scattered across spreadsheets, chats, and shared documents. HackTrack brings the team's work into one place: organize events, assign tasks, track stages, and keep project links ready for submission.

The application combines a React frontend with an Express REST API and PostgreSQL database. The frontend and backend deploy independently as separate Vercel projects.

## Live Application

| Service | URL |
| --- | --- |
| Frontend | [hacktrack-six.vercel.app](https://hacktrack-six.vercel.app) |
| Backend | [hacktrack-backend.vercel.app](https://hacktrack-backend.vercel.app) |
| API health | [/api/health](https://hacktrack-backend.vercel.app/api/health) |

Create a team account, sign in, and add your first hackathon to get started. The health endpoint checks that the API is running; it does not verify database connectivity.

## Features

- **Team workspaces:** Manage team profiles, members, skills, and roles.
- **Hackathon management:** Create and browse hackathons with search and filtering.
- **Task tracking:** Assign work to members, set priorities, and update task status.
- **Stage tracking:** Organize milestones and update progress toward submission.
- **Submission resources:** Store repository, presentation, video, and submission links together.
- **Dashboard:** Review team tasks and hackathon progress.
- **Authentication:** Sign in with team and member credentials, with JWT-protected API routes and bcrypt password hashing.

<details>
  <summary><strong>View the project illustration</strong></summary>
  <br />
  <img src="client/public/preview.png" alt="HackTrack concept illustration showing a team workspace" width="960" />
  <p><em>Project concept artwork; the live interface may differ.</em></p>
</details>

## Technology

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Axios, React Hot Toast |
| Backend | Node.js 24, Express 5 |
| Database | PostgreSQL, Neon, Prisma 7, pg driver adapter |
| Authentication | JSON Web Tokens, bcrypt |
| Hosting | Separate frontend and backend projects on Vercel |

## Architecture

```mermaid
flowchart LR
    Browser[User browser] --> Frontend[React frontend on Vercel]
    Browser -->|HTTPS API requests| Backend[Express API on Vercel]
    Backend -->|Prisma| Database[(Neon PostgreSQL)]
```

Backend requests pass through routes, authentication middleware, controllers, and repositories. Prisma models represent teams, members, hackathons, stages, tasks, and resources.

```text
HackTrack/
├── client/
│   ├── public/               # Logo and public assets
│   ├── src/
│   │   ├── components/       # Shared interface components
│   │   ├── layouts/          # Public and dashboard layouts
│   │   ├── pages/            # Application screens
│   │   ├── services/         # API requests
│   │   └── styles/           # Page and component styles
│   └── vercel.json           # Vite build and SPA routing
├── server/
│   ├── prisma/               # Database schema and migrations
│   ├── src/
│   │   ├── controllers/      # Request handling
│   │   ├── middleware/       # Authentication and fallback handling
│   │   ├── repositories/     # Database operations
│   │   ├── routes/           # API endpoints
│   │   └── lib/              # Prisma client and database adapter
│   ├── prisma.config.js      # Migration connection configuration
│   ├── server.js             # Express entry point
│   └── vercel.json           # Express deployment configuration
└── docker-compose.yml        # Optional container development setup
```

## Run Locally

### Prerequisites

- Node.js **24.x** and npm
- PostgreSQL running locally, or a Neon database
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Gauri-2044/HackTrack.git
cd HackTrack
```

### 2. Configure the backend

Create `server/.env` using your own database credentials:

```dotenv
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
JWT_SECRET=replace-with-a-strong-random-secret
FRONTEND_URL=http://localhost:5173
```

For Neon, use the pooled URL for `DATABASE_URL` and the direct URL for `DIRECT_URL`, preserving the SSL parameters provided by Neon. For local PostgreSQL, both variables can use the same local connection string.

The application reads `DATABASE_URL`; Prisma migrations use `DIRECT_URL`, falling back to `DATABASE_URL`. A variable named `NEON_DB_URL` is not read by the current code.

Generate a JWT secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Install dependencies, generate the Prisma client, apply the committed migrations, and start the API:

```bash
cd server
npm ci
npx prisma generate
npx prisma migrate deploy
npm run dev
```

The API runs at `http://localhost:5000`. Migrations create or update the schema; they do not copy accounts from another database.

### 3. Configure the frontend

Create `client/.env`:

```dotenv
VITE_BASE_API_URL=http://localhost:5000/api
```

In a second terminal, from the repository root:

```bash
cd client
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

> On Windows PowerShell, if script execution blocks npm or npx, use `npm.cmd` and `npx.cmd` instead.

## API Reference

Production base URL: `https://hacktrack-backend.vercel.app/api`

| Method | Endpoint | Purpose | Authentication |
| --- | --- | --- | --- |
| GET | `/health` | API health check | Public |
| POST | `/auth/register` | Register a team and its first member | Public |
| POST | `/auth/login` | Sign in and receive a JWT | Public |
| GET | `/teams/dashboard` | Load the team dashboard | Bearer token |
| GET | `/teams/member/all` | List team members | Bearer token |
| GET | `/hackathon` | List and filter hackathons | Bearer token |
| POST | `/hackathon/create` | Create a hackathon | Bearer token |
| POST | `/hackathon/:id/add-submission` | Save submission resources | Bearer token |
| PATCH | `/hackathon/stage/:stageId/status` | Update a stage | Bearer token |
| POST | `/tasks/add` | Create a task | Bearer token |
| PATCH | `/tasks/:id/status` | Update task status | Bearer token |

Protected requests include `Authorization: Bearer <token>`. See the [route definitions](server/src/routes) for the full endpoint list and the [controllers](server/src/controllers) for request fields.

## Deploy to Vercel

Deploy `client/` and `server/` as **two separate Vercel projects**, each linked from its own directory. The existing `vercel.json` files configure the frontend build and Prisma client generation for the backend.

### Environment variables

Set these in the corresponding project's **Production** environment before deploying:

| Project | Variable | Value |
| --- | --- | --- |
| Frontend | `VITE_BASE_API_URL` | `https://hacktrack-backend.vercel.app/api` |
| Backend | `DATABASE_URL` | Neon pooled PostgreSQL URL |
| Backend | `DIRECT_URL` | Neon direct PostgreSQL URL |
| Backend | `JWT_SECRET` | A strong random secret |
| Backend | `FRONTEND_URL` | `https://hacktrack-six.vercel.app` |
| Backend | `FRONTEND_URLS` | Optional comma-separated additional allowed origins |

When deploying your own copy, replace these domains with your project's production domains. Keep database credentials and JWT secrets exclusively in the backend. Variables prefixed with `VITE_` are exposed to the browser.

### CLI workflow

From the repository root, link and configure the backend:

```bash
npx vercel@latest login
cd server
npx vercel@latest link
npx vercel@latest env add DATABASE_URL production
npx vercel@latest env add DIRECT_URL production
npx vercel@latest env add JWT_SECRET production
npx vercel@latest env add FRONTEND_URL production
```

Choose a dedicated backend project and `./` as its code directory. Use `env update` instead of `env add` for existing variables.

Apply migrations to the intended production database before deploying code that depends on them. These commands download production variables to an ignored local file and apply committed migrations to that database:

```bash
npx vercel@latest env pull .env.production.local --environment=production
node --env-file=.env.production.local node_modules/prisma/build/index.js migrate deploy
npx vercel@latest --prod
```

Install backend dependencies first using the local setup instructions. Back up an existing production database before applying schema changes. Keep `.env*` files and `.vercel/` out of version control.

Then link and deploy the frontend as a different project:

```bash
cd ../client
npx vercel@latest link
npx vercel@latest env add VITE_BASE_API_URL production
npx vercel@latest --prod
```

Use the backend's stable production domain with `/api` appended. If the frontend's assigned domain differs from `FRONTEND_URL`, update that backend variable and redeploy the backend. Environment variable changes require a new deployment; frontend values are embedded during the Vite build.

For preview deployments, configure Preview environment variables and allowed frontend origins separately.

Dockerfiles and Compose are optional container tooling and are not used by this Vercel deployment workflow. The Node/npm setup above is the documented local development path.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Database connection attempts `127.0.0.1:5432` | Backend Production `DATABASE_URL` must contain the hosted database URL; redeploy after updating it. |
| An API request is blocked by CORS | Backend `FRONTEND_URL` must match the frontend origin, including `https://`, without an API path. |
| Database table does not exist | Apply committed Prisma migrations to the database used by the deployed backend. |
| A local account cannot sign in on the deployed app | Local and hosted databases have separate records; register on the hosted app or migrate your data. |
| A frontend URL refresh returns 404 | Keep the SPA fallback rewrite in `client/vercel.json`. |

## Development Commands

| Directory | Command | Purpose |
| --- | --- | --- |
| `client` | `npm run dev` | Start the Vite development server |
| `client` | `npm run build` | Build production assets |
| `client` | `npm run preview` | Preview the frontend build locally |
| `client` | `npm run lint` | Run ESLint |
| `server` | `npm run dev` | Start the API with nodemon |
| `server` | `npm start` | Start the API with Node.js |
| `server` | `npx prisma validate` | Validate the Prisma schema |
| `server` | `npx prisma generate` | Generate the database client |
| `server` | `npx prisma migrate deploy` | Apply committed migrations |

The backend's `npm test` script is currently a placeholder; an automated test suite is not configured.

## Contributing

Bug reports and improvements are welcome. [Open an issue](https://github.com/Gauri-2044/HackTrack/issues) with reproduction steps and expected behavior, or submit a focused pull request describing the change and how you verified it. Never include credentials, tokens, or private environment files.

## Author

Built by [Gauri Bhasme](https://github.com/Gauri-2044).
