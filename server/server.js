import express from 'express';
import dotenv from 'dotenv';
import {pool} from './config/db.js';
import cors from 'cors';

import { teamRouter } from './routes/team.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { hackathonRouter } from './routes/hackathon.routes.js';
import { taskRouter } from './routes/task.routes.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';

dotenv.config();
const app = express();


// CRUCIAL: Parses incoming requests with JSON payloads
app.use(express.json()); 

// Optional: Parses incoming requests from URL-encoded forms
app.use(express.urlencoded({ extended: true })); 
app.use(cors())

//USE Routes
app.use("/api/teams",teamRouter);
app.use("/api/auth",authRouter);
app.use("/api/hackathon",hackathonRouter);
app.use("/api/tasks",taskRouter);

app.get("/", (req, res) => {
  res.send("App is running Successfully");
});

// Catch-all Not Found middleware
app.use(notFoundMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT }`);
});