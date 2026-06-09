import express from 'express';
import { 
    loadProfile, 
    loadDashboard, 
    performanceAnalysis, 
    createTeamMember, 
    getTeamMember, 
    getAllTeamMembers, 
    deleteMember, 
    updateMemberData, 
    updateTeamProfile, 
    deleteTeam 
} from '../controllers/team.controller.js';
import { getTasksForTeam } from '../controllers/task.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const teamRouter = express.Router();

// Protected routes requiring authentication
teamRouter.get('/team-profile', authMiddleware, loadProfile);
teamRouter.patch('/team-profile', authMiddleware, updateTeamProfile);
teamRouter.get('/dashboard', authMiddleware, loadDashboard);
teamRouter.get('/analysis', authMiddleware, performanceAnalysis);
teamRouter.delete('/:id', authMiddleware, deleteTeam);

// Members routes
teamRouter.post('/member/add', authMiddleware, createTeamMember);
teamRouter.get('/member/all', authMiddleware, getAllTeamMembers);
teamRouter.get('/member/:id', authMiddleware, getTeamMember);
teamRouter.patch('/member/:id', authMiddleware, updateMemberData);
teamRouter.delete('/member/:id', authMiddleware, deleteMember);

// Tasks route
teamRouter.get('/tasks', authMiddleware, getTasksForTeam);