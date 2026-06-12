// import { PrismaClient } from '@prisma/client';
import Prisma from '../lib/prisma.js';


//CREATE a Team 
export async function createTeamRepo(teamData){
    return await Prisma.team.create({
        data: teamData //a object
    });
}

export async function addMemberRepo(teamId, member){
    return await Prisma.team.update({
        where:{
            id: teamId
        },
        data: {
            members: {
                push: member
            }
        }
    })
}

//READ ALL Teams
export async function getAllTeamsRepo(){
    return await Prisma.team.findMany();
}

//Get a Team
export async function getTeamByIdRepo(teamId) {
    return await Prisma.team.findUnique({
        where:{
            id : teamId,
        },
    });
}

export async function getTeamByNameRepo(teamName) {
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

//UPDATE team Profile
export async function updateTeamRepo(teamId, teamData) {
    return await Prisma.team.update({
        where:{id:teamId},
        data: teamData
    })
}

//DELETE TEAM
export async function deleteTeamRepo(teamId) {
    await Prisma.team.delete({
  where: {
    id: teamId,
  },
});
}

