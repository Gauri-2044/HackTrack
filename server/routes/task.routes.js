import express from 'express';
import { 
    createTask, 
    getTaskById, 
    updateTaskStatus, 
    editTask, 
    deleteTask 
} from '../controllers/task.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const taskRouter = express.Router();

// Apply authMiddleware to all task routes since they require req.team context
taskRouter.use(authMiddleware);

taskRouter.post('/add', createTask);
taskRouter.get('/:id', getTaskById);
taskRouter.patch('/:id/status', updateTaskStatus);
taskRouter.patch('/:id', editTask);
taskRouter.delete('/:id', deleteTask);