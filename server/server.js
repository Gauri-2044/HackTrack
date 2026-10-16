import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { teamRouter } from './src/routes/team.routes.js';
import { authRouter } from './src/routes/auth.routes.js';
import { hackathonRouter } from './src/routes/hackathon.routes.js';
import { taskRouter } from './src/routes/task.routes.js';
import { notFoundMiddleware } from './src/middleware/notFound.middleware.js';

dotenv.config();
const app = express();


// CRUCIAL: Parses incoming requests with JSON payloads
app.use(express.json()); 

// Optional: Parses incoming requests from URL-encoded forms
app.use(express.urlencoded({ extended: true })); 

const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || "").split(","),
]
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = process.env.NODE_ENV === "production"
  ? configuredOrigins
  : [...configuredOrigins, "http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin(origin, callback) {
    // Requests such as health checks from curl have no browser Origin header.
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
      return callback(null, true);
    }

    return callback(new Error(`CORS origin is not allowed: ${origin}`));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


//USE Routes
app.use("/api/teams",teamRouter);
app.use("/api/auth",authRouter);
app.use("/api/hackathon",hackathonRouter);
app.use("/api/tasks",taskRouter);

app.get("/", (req, res) => {
  res.send("App is running Successfully");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

// Catch-all Not Found middleware
app.use(notFoundMiddleware);

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running at http://localhost:${process.env.PORT }`);
// });

if (!process.env.VERCEL) {
  //on Vercel, the server is automatically started by the platform, so we don't need to listen on a port manually.
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;