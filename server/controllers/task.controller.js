import { 
    addTaskRepo, 
    getAllTasksRepo, 
    getTaskByIdRepo, 
    getAllTasksOfMemberRepo, 
    getAllTasksOfTeamRepo, 
    getAllActiveTasksForTeamRepo, 
    updateTaskStatusRepo, 
    editTaskRepo, 
    deleteTaskRepo 
} from "../repositories/task.repository.js";

// CREATE task
export async function createTask(req, res) {
    try {
        const { taskTitle, assignedToId, hackathonId } = req.body;
        const task = await addTaskRepo({
            title: taskTitle, // Schema has 'title', not 'taskTitle'
            assignedToId: assignedToId ? Number(assignedToId) : null,
            hackathonId: Number(hackathonId),
            teamId: Number(req.team.teamId) // Assigning team from auth middleware context
        });

        return res.status(201).json({
            success: true,
            message: "Task Added Successfully",
            data: task
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// READ tasks
export async function getTaskById(req, res) {
    try {
        const id = Number(req.params.id);
        const task = await getTaskByIdRepo(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// Common task getter with filters
export async function getTasks(req, res) {
    try {
        const { status, priority, search, sortBy, order, page = 1, limit = 10 } = req.query;

        const filters = {
            ...req.baseFilter,
        };

        const allowedStatus = ["todo", "in-progress", "completed"]; // Matches standard values
        if (status && allowedStatus.includes(status)) {
            filters.status = status;
        }
        const allowedPriorities = ["low", "medium", "high"];
        if (priority && allowedPriorities.includes(priority)) {
            filters.priority = priority;
        }
        if (search) {
            filters.title = { contains: search, mode: "insensitive" };
        }

        let orderBy = {
            createdAt: "desc"
        };
        const allowedSortFields = ["title", "createdAt", "assignedToId"];
        if (sortBy && allowedSortFields.includes(sortBy)) {
            orderBy = { [sortBy]: order || "asc" };
        }
        
        // pagination
        const skip = (Number(page) - 1) * Number(limit);

        const result = await getAllTasksRepo({ filters, orderBy, skip, limit: Number(limit) });

        return res.status(200).json({
            success: true,
            message: "Tasks Fetched Successfully",
            data: result
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function getTasksForTeam(req, res) {
    req.baseFilter = {
        teamId: Number(req.team.teamId)
    };
    return getTasks(req, res);
}

export async function getTasksForHackathon(req, res) {
    req.baseFilter = {
        teamId: Number(req.team.teamId),
        hackathonId: Number(req.params.id)
    };
    return getTasks(req, res);
}

export async function getTasksForMember(req, res) {
    req.baseFilter = {
        teamId: Number(req.team.teamId),
        assignedToId: Number(req.params.id)
    };
    return getTasks(req, res);
}

// UPDATE task
export async function updateTaskStatus(req, res) {
    try {
        const taskId = Number(req.params.id);
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status parameter is required"
            });
        }

        const updatedTask = await updateTaskStatusRepo(taskId, status);

        return res.status(200).json({
            success: true,
            message: "Task Status Updated successfully",
            data: updatedTask
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function editTask(req, res) {
    try {
        const taskId = Number(req.params.id);

        const updatedTask = await editTaskRepo(taskId, req.body);

        return res.status(200).json({
            success: true,
            message: "Task Edited",
            data: updatedTask
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// DELETE task
export async function deleteTask(req, res) {
    try {
        const taskId = Number(req.params.id);
        await deleteTaskRepo(taskId);

        return res.status(200).json({
            success: true,
            message: "Task Deleted"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
