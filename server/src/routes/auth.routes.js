//express.Router()
//import middlewares
//import hadlers
import{handleLogin, handleRegister, loginTeam, registerTeam} from '../controllers/auth.controller.js'
import express from 'express';
export const authRouter = express.Router();

//all with respect to team
authRouter.get('/login',handleLogin);
authRouter.post('/login', loginTeam);
authRouter.get('/register', handleRegister);
authRouter.post('/register', registerTeam);