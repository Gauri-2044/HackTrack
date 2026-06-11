import axios from 'axios';
import toast from 'react-hot-toast';

// Read API URL from Vite environment variable
const BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:5000/api';

export async function getDashboardData(token) {
  try {
    const response = await axios.get(`${BASE_URL}/teams/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      // Don't show toast.success here to prevent spamming the user on page loads/refreshes
      return response.data;
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to load dashboard data. Please try again.';
    toast.error(errorMsg);
    return null;
  }
}