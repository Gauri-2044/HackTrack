import Prisma from "../lib/prisma.js";

// CREATE 
export async function createStageRepo(stageData) {
    return await Prisma.stage.create({
        data: stageData
    });
}

// READ
export async function getStagesRepo(filters) {
    return await Prisma.stage.findMany({
        where: filters,
        orderBy: {
            deadline: "asc"
        }
    });
}

// UPDATE
export async function updateStageStatusRepo(stageId, status) {
    return await Prisma.stage.update({
        where: {
            id: Number(stageId)
        },
        data: {
            status: status
        }
    });
}

// DELETE 
export async function deleteStageRepo(stageId) {
    return await Prisma.stage.delete({
       where:{
           id: Number(stageId)
       }
    });
}