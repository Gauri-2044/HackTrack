# HackTrack – Hackathon Team Management Platform

HackTrack is a collaborative hackathon management platform designed for student teams to efficiently manage hackathons, tasks, resources, and team workflows in one centralized workspace.

The platform helps teams track hackathon registrations, monitor progress, manage tasks, share resources, and collaborate effectively throughout the hackathon lifecycle.

---

## Features

-  Team-based Authentication using JWT
-  Secure Team Code Hashing using bcrypt
-  Team & Member Management
-  Hackathon Tracking System
-  Task Management with Status Updates
-  Resource Management (GitHub, PPT, Video, Submission Links)
-  PostgreSQL Database Integration
-  Prisma ORM for Database Operations
-  Modular Backend Architecture
-  RESTful APIs
-  Authentication Middleware
-  Scalable Repository-Service-Controller Pattern


### Tech Stack

#### Backend

- Node.js
- Express.js

#### Database

- PostgreSQL

#### ORM

- Prisma ORM

#### Authentication & Security

- JWT Authentication
- bcrypt Password Hashing

---

###  Project Structure
```bash
src/
│
├── controllers/
├── services/
├── repositories/
├── routes/
├── middlewares/
├── lib/
│
└── app.js
```


### Architecture Flow
```bash
Client
 ↓
Routes
 ↓
Controllers
 ↓
Services
 ↓
Repositories
 ↓
Prisma ORM
 ↓
PostgreSQL
```

### Database Models
```bash 
Team

- teamName
- teamCode
- createdAt

Member

- userName
- skills
- score

Hackathon

- hackathonName
- platform
- status

Task

- title
- status

Resource

- githubLink
- pptLink
- videoLink
- submissionLink

```
🔐 Authentication Flow

1. Team registers with Team Name & Team Code
2. Team Code is hashed using bcrypt
3. Login validates hashed credentials
4. JWT token generated after successful login
5. Protected routes verified using authentication middleware

---

⚙️ Installation

Clone Repository

git clone <repository-url>
cd hacktrack

Install Dependencies

npm install

Setup Environment Variables

Create ".env" file:

DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_secret_key

Run Prisma Migration

npx prisma migrate dev --name init

Start Server

npm run dev

### Deploying the backend to Vercel

Create the Vercel project from this repository and set **Root Directory** to
`server`. The backend `vercel.json` and `package.json` must be resolved from
that directory; deploying the repository root does not expose `server.js` and
results in a Vercel 404.

Add these environment variables in the Vercel project settings:

- `DATABASE_URL`: your hosted PostgreSQL connection string
- `JWT_SECRET`: the production JWT secret
- `FRONTEND_URL`: the deployed frontend origin, including `https://` and
  without a trailing path

After deployment, verify `https://<backend-domain>/api/health` returns a JSON
success response. The frontend must set `VITE_BASE_API_URL` to
`https://<backend-domain>/api` before it is built and redeployed.

---

###  API Endpoints

Authentication

- POST "/team/register"
- POST "/team/login"

Hackathons

- POST "/hackathon/create"
- GET "/hackathon/all"

Tasks

- POST "/task/create"
- PATCH "/task/update-status"

---

### Future Improvements

- Role-based Access Control
- Real-time Team Collaboration
- Notifications & Reminders
- Analytics Dashboard
- File Upload Support
- Kanban Task Board
- AI-powered Hackathon Recommendations

---

### Learning Outcomes

This project helped in understanding:

- REST API Design
- Backend Architecture
- Database Relationships
- Prisma ORM
- JWT Authentication
- Password Hashing
- Middleware Handling
- Repository Pattern
- Error Handling
- Full Backend Workflow

---

👨‍💻 Developed By

Gauri Bhasme