import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:5000/api';

export async function getHackathons(token, filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.platform) params.append('platform', filters.platform);

    const response = await axios.get(`${BASE_URL}/hackathon?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      return response.data.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to fetch hackathons.';
    toast.error(errorMsg);
    return null;
  }
}

export async function createHackathon(token, hackathonData) {
  try {
    const response = await axios.post(`${BASE_URL}/hackathon/create`, hackathonData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      toast.success(response.data.message || 'Hackathon created successfully!');
      return response.data.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to create hackathon.';
    toast.error(errorMsg);
    return null;
  }
}

export async function deleteHackathon(token, id) {
  try {
    const response = await axios.delete(`${BASE_URL}/hackathon/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      toast.success(response.data.message || 'Hackathon deleted successfully.');
      return true;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to delete hackathon.';
    toast.error(errorMsg);
    return false;
  }
}

export async function getHackathonDetails(token, id) {
  try {
    const response = await axios.get(`${BASE_URL}/hackathon/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      return response.data.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to fetch hackathon details.';
    toast.error(errorMsg);
    return null;
  }
}

export async function addHackathonSubmission(token, id, submissionData) {
  try {
    const response = await axios.post(`${BASE_URL}/hackathon/${id}/add-submission`, submissionData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      toast.success(response.data.message || 'Submissions saved successfully!');
      return response.data.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to add submissions.';
    toast.error(errorMsg);
    return null;
  }
}

export async function updateStageStatus(token, stageId, status) {
  try {
    const response = await axios.patch(`${BASE_URL}/hackathon/stage/${stageId}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      toast.success('Stage status updated successfully.');
      return true;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to update stage status.';
    toast.error(errorMsg);
    return false;
  }
}
