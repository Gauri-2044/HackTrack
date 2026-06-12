import Prisma from "../lib/prisma.js";

//CREATE
export async function createHackathonRepo(hackathonData){
    return await Prisma.hackathon.create({
        data: hackathonData,
    });
}

//READ
export async function getHackathonByIdRepo(hackathonId){
    return await Prisma.hackathon.findUnique({
        where:{
            id:hackathonId,
        },
        include: {
            stages: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            resources: true,
            tasks: {
                include: {
                    assignedTo: true
                }
            }
        }
    });
}

export async function getAllHackathonsRepo({filters, orderBy, skip, limit}){
    return await Prisma.hackathon.findMany({
        where:filters,
        orderBy,
        skip,
        take:limit,
        include:{stages:true, tasks:true}
    });
}

export async function getAllHackathonsWithTeamIdRepo(teamID) {
    return await Prisma.hackathon.findMany({
        where:{
            teamId: teamID,
        }
    });   
}

//Update
export async function updateStatusRepo(hackathonId, status) {
    return await Prisma.hackathon.update({
        where:{
            id: hackathonId,
        },
        data:{
            status: status,
        }
    })
    
}

//DELETE
export async function deleteHackathonRepo(hackathonId) {
    return await Prisma.hackathon.delete({
        where:{
            id: hackathonId,
        }
    }); 
}