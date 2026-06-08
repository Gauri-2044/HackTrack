// CREATE task
import { addTask, getAllTasksOfMember, getAllTasksOfTeam, getAllActiveTasksForTeam } from "../repositories/task.repository.js";

export async function createTask(req, res) {
    try{
        //take from body
    const {taskTitle, assignedToId, hackathonId} = req.body;
    const task = await addTask({
        taskTitle:taskTitle,
        assignedToId: assignedToId,
        hackathonId: hackathonId
    });

    return res.send(201).json({
        success:true,
        message:"Task Added Successfully",
        data:task
    });
    }catch(err){
        return res.send(500).json({
        success:false,
        message:err.message
    });
    }
}

//READ tasks

export async function getTasksForTeam(req, res) {
    try{
        const tasks = await getAllTasksOfTeam(req.team.teamId);
    }catch(err){
        return res.send(500).json({
            success:false,
            message:err.message
        })
    }
}

// export async function getTasksForMember(req, res) {
    
// }



//UPDATE task
export async function updateTaskStatus(req, res) {
    
}

export async function updateTask(req, res) {
    
}

//DELETE task
export async function deleteTask(req, res) {
    
}

