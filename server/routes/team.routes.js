//express.Router()
import{loadProfile, loadDashboard, performanceAnalysis, createTeamMember, getTeamMember, getAllTeamMembers} from '../controllers/team.controller.js'
import express from 'express';
export const teamRouter = express.Router();

//protect routes with JWT token verification at authMiddleware
import { authMiddleware } from '../middleware/auth.middleware.js';

//protected routes
teamRouter.get('/team-profile', authMiddleware, loadProfile);
teamRouter.get('/dashboard', authMiddleware, loadDashboard);
teamRouter.get('/analysis', authMiddleware, performanceAnalysis);
// teamRouter.post('/member', authMiddleware, createTeamMember);
teamRouter.post('/member/add', authMiddleware, createTeamMember);
teamRouter.get('/member/all', authMiddleware, getAllTeamMembers);
teamRouter.get('/member/:id', authMiddleware, getTeamMember);