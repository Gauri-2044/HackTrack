import express from 'express';
import {createTask} from '../controllers/task.controller.js';
export const taskRouter = express.Router();

taskRouter.post('/add', createTask);
taskRouter.get('/:id', getTaskById);