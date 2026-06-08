
import express from 'express';
export const hackathonRouter = express.Router();
import { getAllHackathons, getHackathon, addSubmissions, updateStatus, deleteHackathon, createHackathon } from '../controllers/hackathon.controller.js';

hackathonRouter.get('/', getAllHackathons);
hackathonRouter.post('/create', createHackathon);
hackathonRouter.get('/:id', getHackathon);

