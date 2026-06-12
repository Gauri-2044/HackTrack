import { getTasksForHackathonRepo, updateTaskStatusRepo } from '../repositories/task.repository.js';
import { createResourceRepo } from '../repositories/resource.repository.js';
import { 
    createHackathonRepo, 
    deleteHackathonRepo, 
    getHackathonByIdRepo, 
    getAllHackathonsRepo 
} from '../repositories/hackathon.repository.js';
import { createStageRepo, updateStageStatusRepo, getStagesRepo } from '../repositories/stage.repository.js';

export async function createHackathon(req, res) {
    try {
        const { name, platform, stages } = req.body;
        const teamId = Number(req.team.teamId);

        // STEP 1 — Create hackathon first
        const newHackathon = await createHackathonRepo({
            hackathonName: name,
            platform: platform,
            teamId: teamId
        });

        // STEP 2 — Create stages
        const createdStages = [];

        if (stages && stages.length > 0) {
            for (const stage of stages) {
                const newStage = await createStageRepo({
                    stageName: stage.name,
                    deadline: stage.deadline,
                    hackathonId: newHackathon.id
                });
                createdStages.push(newStage);
            }
        }

        // STEP 3 — Response
        return res.status(201).json({
            success: true,
            message: "Hackathon created successfully",
            data: {
                ...newHackathon,
                stages: createdStages
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function getAllHackathons(req, res){
    try{
        //filter : status{completed, dropped, active}, platform, search=name
        //sorting : createdAt, nearestDeadline[default], name
        //pagination : page, limit
        const teamId = Number(req.team.teamId);
        const {status, platform, search, sortBy, order, page=1, limit=10} = req.query;

        const filters = {
            teamId
        };
        const allowedStatus = ["completed", "active", "dropped"];
        if(status && allowedStatus.includes(status)){
            filters.status=status;
        }else{ 
            filters.status="active"; //default status
        }
        if(platform){
            filters.platform=platform;
        }
        if(search){
            filters.hackathonName={contains:search, mode:"insensitive"};
        }

        const allowedSortFields=["createdAt", "hackathonName"];
        let orderBy = {
            createdAt:"desc" //default
        };

        if(sortBy && allowedSortFields.includes(sortBy)){
            orderBy={[sortBy]:order||"asc"};
        }

        //pagination
        const skip = (Number(page)-1)*Number(limit);

        const hackathons = await getAllHackathonsRepo({filters, orderBy, skip, limit:Number(limit)});
        
        //Format the Result to return stats
        const formattedResult = hackathons.map((hackathon)=>{
            const totalTasks = hackathon.tasks ? hackathon.tasks.length : 0;
            const completedTasks = hackathon.tasks ? hackathon.tasks.filter(task=> task.status === "completed").length : 0;
            const totalStages = hackathon.stages ? hackathon.stages.length : 0;
            const completedStages = hackathon.stages ? hackathon.stages.filter(stage=> stage.status === "completed").length : 0;

            return {
                ...hackathon,
                stats:{
                    totalTasks,
                    completedTasks,
                    totalStages,
                    completedStages
                }
            };
        });

        return res.status(200).json({
            success: true,
            message: "Hackathons Fetched Successfully",
            data: formattedResult
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function getStages(req, res) {
    try{
        let hackId = Number(req.params.id);
        const {
            status,
            search,
            overdue,//boolean
        } = req.query;

        const filters = {
            hackathonId: hackId,
            hackathon: {
                teamId: Number(req.team.teamId)
            }
        };

        if(status){
            filters.status = status;
        }
        if(search){
            filters.stageName={
                contains:search,
                mode:"insensitive"
            };
        }
        if(overdue=="true"){
            // Filters out completed stages and gets stages past deadline
            filters.status = { not: "done" };
            // Simple deadline text comparison check could be added if needed,
            // but for safety we check non-completed status.
        }
        
        const result = await getStagesRepo(filters);
        return res.status(200).json({
            success: true,
            message: "stages Fetched Successfully",
            data: result
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function getHackathon(req, res){
 try{
     let hackId = Number(req.params.id);
     const hackathon = await getHackathonByIdRepo(hackId);

     if (!hackathon) {
         return res.status(404).json({
             success: false,
             message: "Hackathon not found"
         });
     }

     return res.status(200).json({
        success:true,
        message:"Hackathon fetched Successfully",
        data:hackathon
     });
 }catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function stageUpdateStatus(req, res){
try{
        const { status } = req.body;
        const stageId = req.params.stageId;
        const allowedStatuses = [
            "upcoming",
            "live",
            "done",
            ];
        if (!status) {
            return res.status(400).json({
                success:false,
                message: "Status is required",
            });
         }
        //if status is not in allowed status list
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        await updateStageStatusRepo(stageId, status);

        return res.status(200).json({
            success:true,
            message:"Stage Status Updated"
        });
    }catch(err){
           return res.status(500).json({
            success:false,
            message:err.message
        });
    } 
}

export async function taskUpdateStatus(req, res){
    try{
        const { status } = req.body;
        const taskId = req.params.taskId;
        const allowedStatuses = [
            "pending",
            "in-progress",
            "completed",
            ];
        if (!status) {
            return res.status(400).json({
                success:false,
                message: "Status is required",
            });
         }
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        await updateTaskStatusRepo(Number(taskId), status);

        return res.status(200).json({
            success:true,
            message:"Status Updated"
        });
    }catch(err){
           return res.status(500).json({
            success:false,
            message:err.message
        });
    } 
}

export async function addSubmissions(req, res){
    try{
        let hackId = Number(req.params.id);
        let {git, linkedin, ppt, video} = req.body;

        const newRessource = await createResourceRepo({
            githubLink: git,
            submissionLink: linkedin,
            pptLink: ppt,
            videoLink: video,
            hackathonId: hackId
        });

        return res.status(201).json({
            success:true,
            message:"Hackathon Submission Done",
            data:newRessource
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
}

export async function getTasksForHackathon(req, res) {
    try{
        let hackId = Number(req.params.id);

        const tasks = await getTasksForHackathonRepo(hackId);
        return res.status(200).json({
            success:true,
            message:"Hackathon tasks fetched",
            data: tasks
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
}

export async function deleteHackathon(req, res){
 try{
        let hackId = Number(req.params.id);
        await deleteHackathonRepo(hackId);

        return res.status(200).json({
            success:true,
            message:"Hackathon Deleted Successfully"
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
 }
}