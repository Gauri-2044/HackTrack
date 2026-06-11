import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:5000/api';

export async function addTask(token, taskData) {
  try {
    const response = await axios.post(`${BASE_URL}/tasks/add`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      toast.success(response.data.message || 'Task created successfully!');
      return response.data.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to add task.';
    toast.error(errorMsg);
    return null;
  }
}

export async function updateTaskStatus(token, id, status) {
  try {
    const response = await axios.patch(`${BASE_URL}/tasks/${id}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      toast.success('Task status updated.');
      return response.data.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to update task status.';
    toast.error(errorMsg);
    return null;
  }
}

export async function deleteTask(token, id) {
  try {
    const response = await axios.delete(`${BASE_URL}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      toast.success('Task deleted successfully.');
      return true;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to delete task.';
    toast.error(errorMsg);
    return false;
  }
}
