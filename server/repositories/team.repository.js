// import { PrismaClient } from '@prisma/client';
import Prisma from '../lib/prisma.js';

//CREATE a Team 
export async function createTeam(teamData){
    return await Prisma.team.create({
        data: teamData //a object
    });
}

//READ ALL Teams
export async function getAllTeams(){
    return await Prisma.team.findMany();
}

//Get a Team
export async function getTeam(teamName) {
    return await Prisma.team.findFirst({
        where:{
            teamName : teamName,
        },
    });
}

//Update a Teams Data 
// export async function updateTeam(teamData) {
//     return await Prisma.team.update{
//         where:{
//             teamId: teamData.teamId,
//         },
//         update:{

//         },
//     }
// }

//UPDATE Teams Score
//Check it Once **********
// export async function updateScore(teamId, num) {
//     return await Prisma.team.updateMany({
//         data: {
//     score: { increment: 1 }
//     }
//     });
// }

//DELETE TEAM
export async function deleteTeam(teamId) {
    await Prisma.team.delete({
  where: {
    id: teamId,
  },
});
}

