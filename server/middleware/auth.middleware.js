import {verifyAndDecodeToken} from '../config/jwt.js';

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

        next();
    }catch(err){
        return res.status(401).json({
            message:"Invalid Token"
        });
    }
}