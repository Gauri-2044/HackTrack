import {verifyAndDecodeToken} from '../config/jwt.js';
import dotenv from 'dotenv';
dotenv.config();

export function authMiddleware(req, res, next){

    try{

        const authHeader = req.headers.authorization;
        if(!authHeader) 
                return res.status(401).json({
                    message:"Token Missing"
            });
        
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Token Format Invalid (Bearer token expected)"
            });
        }

        req.team = verifyAndDecodeToken(token);

        // now req.team={
        //     teamId, teamName
        // }
        //AB YE WALA HUM KHI PAR BHI ACCESS KR SAKTE HAII

        next();
    }catch(err){
        return res.status(401).json({
            // message:"Invalid Token"
            message: err.message
        });
    }
}