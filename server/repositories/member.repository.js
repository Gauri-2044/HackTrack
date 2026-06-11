import Prisma from "../lib/prisma.js";

// CREATE
export async function createMemberRepo(memberData) {
    return await Prisma.member.create({
        data: memberData, // pass an object
    });
}

// READ
export async function getMemberByIdRepo(memberId) {
    return await Prisma.member.findUnique({
        where:{
            id: memberId,
        }
    });
}

export async function getMemberByEmailRepo(email) {
    return await Prisma.member.findUnique({
        where:{
            email:email,
        }
    });
}

export async function getAllMembersRepo(filters, orderBy) {
    return await Prisma.member.findMany({
        where: filters,
        orderBy: orderBy
    });
}

// UPDATE
export async function editMemberRepo(memberId, memberData) {
    return await Prisma.member.update({
        where: {
            id: memberId
        },
        data: memberData
    });
}

// DELETE
export async function deleteMemberByIdRepo(memberId) {
    return await Prisma.member.delete({
        where:{
            id: memberId,
        }
    });
}