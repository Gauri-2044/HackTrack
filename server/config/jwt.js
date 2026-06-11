import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function generateToken(team, member){

    return jwt.sign({
        teamId: team.id,
        teamname: team.teamName,
        email: member.email
    },process.env.JWT_SECRET, { expiresIn: "7d"});
}

export function verifyAndDecodeToken(token){
 return jwt.verify(token, process.env.JWT_SECRET);
}