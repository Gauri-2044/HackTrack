import Prisma from "../lib/prisma.js";

export async function addTask(taskData){
    return await Prisma.team.create({
        data:taskData
    });
}

export async function getAllTasksOfMember(memId){
    return await Prisma.task.findMany({
        where:{
            assignedToId: memId
        }
    });
}

export async function getAllTasksOfTeam(teamId) {
    return await Prisma.task.findMany({
        where:{
            teamId: teamId
        }
    });
}
export async function getAllActiveTasksForTeam(teamId) {
    return await Prisma.task.findMany({
        where:{
            teamID: teamId,
            status: "active"
        }
    });
}