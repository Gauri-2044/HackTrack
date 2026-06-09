import express from 'express';
import { 
    getAllHackathons, 
    getHackathon, 
    addSubmissions, 
    createHackathon, 
    getTasksForHackathon, 
    deleteHackathon, 
    getStages, 
    stageUpdateStatus, 
    taskUpdateStatus 
} from '../controllers/hackathon.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const hackathonRouter = express.Router();

// Apply authMiddleware to all hackathon routes
hackathonRouter.use(authMiddleware);

hackathonRouter.get('/', getAllHackathons);
hackathonRouter.post('/create', createHackathon);
hackathonRouter.get('/:id', getHackathon);
hackathonRouter.delete('/:id', deleteHackathon);
hackathonRouter.post('/:id/add-submission', addSubmissions);
hackathonRouter.get('/:id/tasks', getTasksForHackathon);

// Stages and status routes
hackathonRouter.get('/:id/stages', getStages);
hackathonRouter.patch('/stage/:stageId/status', stageUpdateStatus);
hackathonRouter.patch('/task/:taskId/status', taskUpdateStatus);
