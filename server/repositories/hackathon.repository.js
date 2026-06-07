import Prisma from "../lib/prisma.js";

//CREATE
export async function createHackathon(hackathonData){
    return await Prisma.hackathon.create({
        data: hackathonData,
    });
}

//READ
export async function getHackathonById(hackathonId){
    return await Prisma.hackathon.findUnique({
        where:{
            id:hackathonId,
        }
    });
}

export async function getAllHackathons(){
    return await Prisma.hackathon.findMany();
}

export async function getAllHackathonsWithTeamId(teamID) {
    return await Prisma.hackathon.findMany({
        where:{
            teamId: teamID,
        }
    });   
}

//Update
export async function updateStatus(hackathonId, status) {
    return await Prisma.hackathon.update({
        where:{
            id: hackathonId,
        },
        update:{
            status: status,
        }
    })
    
}

//DELETE
export async function deleteHackathon(hackathonId) {
    return await Prisma.hackathon.delete({
        where:{
            id: hackathonId,
        }
    }); 
}