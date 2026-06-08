import Prisma  from "../lib/prisma.js";

//CREATE
export async function createMember(memberData) {
    return await Prisma.member.create({
        data:memberData, //pass an object
    })
}

//READ
export async function getMemberById(memberId) {
    return await Prisma.member.findUnique({
        where:{
            id:memberId,
        }
    })
}

export async function  getAllMembers(id) {
    return await Prisma.member.findMany({
        where:{
            teamId:id
        }
    });
}

//UPDATE

//DELETE
export async function deleteMemberById(memberId) {
    return await Prisma.member.delete({
        where:{
            id: memberId,
        }
    })
}