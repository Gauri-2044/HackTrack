//express.Router()
import{loadProfile, loadDashboard, performanceAnalysis} from '../controllers/team.controller.js'
import express from 'express';
export const teamRouter = express.Router();

//protect routes with JWT token verification at authMiddleware
import { authMiddleware } from '../middleware/auth.middleware.js';

//protected routes
teamRouter.get('/profile', authMiddleware, loadProfile);
teamRouter.get('/dashboard', authMiddleware, loadDashboard);
teamRouter.get('/analysis', authMiddleware, performanceAnalysis);