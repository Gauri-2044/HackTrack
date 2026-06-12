import { createMemberRepo, getMemberByIdRepo, deleteMemberByIdRepo, getAllMembersRepo, editMemberRepo } from '../repositories/member.repository.js';
import { getAllTasksOfMemberRepo } from '../repositories/task.repository.js';
import bcrypt from 'bcrypt';

//TEAM Creation is done Via Auth

//Profile Of Team
//team ka data
import { getTeamByIdRepo, deleteTeamRepo } from '../repositories/team.repository.js';

//members 

//hackathons
import { getAllHackathonsWithTeamIdRepo } from '../repositories/hackathon.repository.js';
//tasks
import { getAllActiveTasksForTeamRepo } from '../repositories/task.repository.js';


//update profile 
import { updateTeamRepo } from '../repositories/team.repository.js';


export async function loadProfile(req, res) {
    try {
        const team = await getTeamByIdRepo(Number(req.team.teamId));
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team profile not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Team profile loaded successfully",
            data: team
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function loadDashboard(req, res) {
    try {
        const teamId = Number(req.team.teamId);

        //team Info
        let team = await getTeamByIdRepo(teamId);

        //members
        let members = await getAllMembersRepo({ teamId });

        //hackathons
        let hackathons = await getAllHackathonsWithTeamIdRepo(teamId);

        let activeTasks = await getAllActiveTasksForTeamRepo(teamId);

        return res.status(200).json({
            success: true,
            message: "Dashboard loaded successfully",
            data: {
                team,
                members,
                hackathons,
                activeTasks
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function performanceAnalysis(req, res) {
    try {
        const teamId = Number(req.team.teamId);
        const members = await getAllMembersRepo({ teamId });
        
        // Simple performance stats based on member scores
        const totalScore = members.reduce((sum, member) => sum + (member.score || 0), 0);
        const averageScore = members.length > 0 ? (totalScore / members.length) : 0;
        
        // Sort members by score descending
        const rankings = [...members].sort((a, b) => (b.score || 0) - (a.score || 0));

        return res.status(200).json({
            success: true,
            message: "Performance analysis fetched successfully",
            data: {
                totalMembers: members.length,
                totalScore,
                averageScore,
                rankings: rankings.map(m => ({
                    id: m.id,
                    userName: m.userName,
                    score: m.score,
                    role: m.role
                }))
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


//TEAM MEMBERS DONE !!

export async function createTeamMember(req, res) {
    try {
        const teamId = Number(req.team.teamId);
        const { memberName, email, password, role, skills } = req.body;

        if (!memberName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing member name, email, or password."
            });
        }

        console.log("teamId:", teamId);
        console.log("memberData:", {
            userName: memberName,
            email,
            role: role || "Member",
            skills: skills || [],
            teamId
        });

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        //create an object of member
        const newMember = await createMemberRepo({
            userName: memberName,
            email,
            password: hashedPassword,
            role: role || "Member",
            skills: skills || [],
            teamId: teamId,
        });

        return res.status(201).json({
            success: true,
            message: "Member added Successfully",
            data: {
                id: newMember.id,
                userName: newMember.userName,
                email: newMember.email,
                role: newMember.role,
                skills: newMember.skills
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function getAllTeamMembers(req, res) {
    try {

        const {
            skill,
            role,
            minScore,
            search,
            sortBy,
            order
        } = req.query;

        const filters = {
            //default ek filter to hoga hi as teamId to get only members of the team
            teamId:Number(req.team.teamId)
        };

        if(skill){
            //add skills filter in filter object
            filters.skills={has:skill}
        }
        if(role){
            filters.role={has:role}
        }
        if(minScore){
            filters.score={gte:Number(minScore)}
        }
        //search by Name
        if(search){
            filters.userName={contains:search, mode:"insensitive"}
        }

        let orderBy = {}
        const allowedSortFields = ["score", "joinedAt", "userName"]
        if(sortBy && allowedSortFields.includes(sortBy)){
            orderBy= {[sortBy]:order||"asc"};
        }

        const result = await getAllMembersRepo(filters, orderBy);

        return res.status(200).json({
            success: true,
            message: "Members Fetched Successfully",
            data: result
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

}

export async function getTeamMember(req, res) {
    try {
        let memberId = parseInt(req.params.id);
        if (isNaN(memberId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid member ID"
            });
        }
        //get the member from DB and return it 
        const member = await getMemberByIdRepo(memberId);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member Doesn't Exist"
            });
        }
        //get related tasks
        const tasks = await getAllTasksOfMemberRepo(memberId);

        return res.status(200).json({
            success: true,
            data: {
                id: member.id,
                memberName: member.userName,
                skills: member.skills,
                role: member.role,
                joinedAt: member.joinedAt,
                githubURL: member.githubURL,
                linkedinURL: member.linkedinURL,
                portfolioURL: member.portfolioURL,
                tasks: tasks
            },
            message: "Member Fetched Successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Can't Fetch Member Try Again",
            error: err.message
        });
    }
}

//UPDATE
export async function deleteMember(req, res) {
    try {
        let memId = Number(req.params.id);

        await deleteMemberByIdRepo(memId);
        res.status(204).json({
            success: true,
            message: "Member Removed"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

}

export async function updateMemberData(req, res) {
    try {
        let id = Number(req.params.id);
        const updatedMember = await editMemberRepo(id, req.body);

        return res.status(200).json({
            success: true,
            message: "Member Profile Edited",
            data: updatedMember
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
export async function updateTeamProfile(req, res) {
    try {
        let id = Number(req.team.teamId);
        const updatedTeam = await updateTeamRepo(id, req.body);

        return res.status(200).json({
            success: true,
            message: "Team Profile Edited",
            data: updatedTeam
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function deleteTeam(req, resd) {
    try {
        let teamId = Number(req.params.id);

        await deleteTeamRepo(teamId);

        res.status(204).json({
            success: true,
            message: "Team Deleted"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}