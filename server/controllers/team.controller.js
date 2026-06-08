
//adding team member
import {createMember} from '../repositories/member.repository.js';

//member profile
import { getMemberById } from '../repositories/member.repository.js';
import {getAllTasksOfMember} from '../repositories/task.repository.js';

//team ki profile

//team ka data
import {getTeam} from '../repositories/team.repository.js';

//members 
import {getAllMembers} from '../repositories/member.repository.js';

//hackathons
import {getAllHackathons} from '../repositories/hackathon.repository.js';
//tasks
import {getAllActiveTasksForTeam} from '../repositories/task.repository.js'

export async function loadProfile(req, res){

}

export async function loadDashboard(req, res){
    try{

        //team Info
        let team = await getTeam(req.team.teamId)

        //members
        let members = await getAllMembers(req.team.teamId);

        //hackathons
        let hackathons = await getAllHackathons(req.team.teamId);

        let activeTasks = await getAllActiveTasksForTeam(req.team.teamId)

    }catch(err){
        return res.send(500).json({
            success: false,
            message: err.message
        })
    }
}

export async function performanceAnalysis(req, res){

}

export async function createTeamMember(req, res){
    try{
        const team = req.team;
        const {memberName, skills} = req.body;
        //create a object of member
        const newMember = await createMember({
            userName: memberName,
            skills: skills,
            teamId: team.teamId,
        });

        return res.status(201).json({
            success:true,
            message: "Member added Successfully",
            data: newMember
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

export async function getAllTeamMembers(req, res){
    try {
        const result = await getAllMembers(req.team.teamId);

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

export async function getTeamMember(req, res){
    try{
        let memberId = parseInt(req.params.id);
        if (isNaN(memberId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid member ID"
            });
        }
        //get the member from DB and return it 
        const member = await getMemberById(memberId);
        if(!member) {
            return res.status(404).json({
                success:false,
                message:"Member Doesn't Exist"
            });
        }
        //get related tasks
        const tasks = await getAllTasksOfMember(memberId);

        return res.status(200).json({
            success:true,
            data: {
            id: member.id,
            memberName: member.userName,
            skills: member.skills,
            role:member.role,
            joinedAt: member.joinedAt,
            githubURL: member.githubURL,
            linkedinURL: member.linkedinURL,
            portfolioURL: member.portfolioURL,
            tasks: tasks
           },
           message:"Member Fetched Successfully"
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message:"Can't Fetch Member Try Again",
            error: err.message
        });
    }
}