import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from './api';

export async function getTeamMembers(token) {
  try {
    const response = await axios.get(`${BASE_URL}/teams/member/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.data.success) {
      return response.data.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to fetch team members.';
    toast.error(errorMsg);
    return null;
  }
}

export async function addTeamMember(token, memberData) {
  try {
    const response = await axios.post(`${BASE_URL}/teams/member/add`, memberData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.data.success) {
      toast.success(response.data.message || 'Member added successfully!');
      return response.data.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to add team member.';
    toast.error(errorMsg);
    return null;
  }
}

export async function getTeamProfile(token) {
  try {
    const response = await axios.get(`${BASE_URL}/teams/team-profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.data.success) {
      return response.data.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to load team profile.';
    toast.error(errorMsg);
    return null;
  }
}

export async function updateMemberProfile(token, id, updateData) {
  try {
    const response = await axios.patch(`${BASE_URL}/teams/member/${id}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.data.success) {
      toast.success(response.data.message || 'Profile updated successfully!');
      return response.data.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to update profile.';
    toast.error(errorMsg);
    return null;
  }
}

export async function updateTeamProfile(token, updateData) {
  try {
    const response = await axios.patch(`${BASE_URL}/teams/team-profile`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.data.success) {
      toast.success(response.data.message || 'Team profile updated!');
      return response.data.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to update team profile.';
    toast.error(errorMsg);
    return null;
  }
}
