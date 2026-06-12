import Prisma from "../lib/prisma.js";

// CREATE Task
export async function addTaskRepo(taskData){
    return await Prisma.task.create({
        data: taskData
    });
}

// READ Tasks
export async function getTaskByIdRepo(id) {
    return await Prisma.task.findUnique({
        where: {
            id: id
        }
    });
}

export async function getAllTasksRepo({ filters, orderBy, skip, limit }) {
    return await Prisma.task.findMany({
        where: filters,
        orderBy: orderBy,
        skip: skip,
        take: limit
    });
}

export async function getAllTasksOfMemberRepo(memId){
    return await Prisma.task.findMany({
        where:{
            assignedToId: memId
        }
    });
}

export async function getAllTasksOfTeamRepo(teamId) {
    return await Prisma.task.findMany({
        where:{
            teamId: teamId
        }
    });
}

export async function getAllActiveTasksForTeamRepo(teamId) {
    return await Prisma.task.findMany({
        where:{
            teamId: teamId,
            status: "active"
        }
    });
}

export async function getTasksForHackathonRepo(hackId) {
    return await Prisma.task.findMany({
        where:{
            hackathonId: hackId
        }
    });
}

// UPDATE Task
export async function updateTaskStatusRepo(taskId, status) {
     return await Prisma.task.update({
        where: { 
            id: taskId 
        },
        data: { 
            status: status 
        }
    });
}

export async function editTaskRepo(taskId, taskData) {
     return await Prisma.task.update({
        where: { 
            id: taskId 
        },
        data: taskData
     });
}

// DELETE Task
export async function deleteTaskRepo(id) {
    return await Prisma.task.delete({
        where:{
            id: id
        }
    });
}