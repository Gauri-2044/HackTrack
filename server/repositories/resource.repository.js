import Prisma  from "../lib/prisma.js";

export async function createResourceRepo(resourceData) {
    return await Prisma.resource.create({
        data:resourceData
    });
}

export async function getHackathonResourceRepo(hackId) {
    return await Prisma.resource.findFirst({
        where:{
            hackathonId:hackId
        }
    });
}
export async function deleteResourceRepo(resId) {
    return await Prisma.resource.delete({
        where:{
            id:resId
        }
    });
}
