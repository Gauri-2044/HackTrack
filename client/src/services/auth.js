import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from './api';

export async function register(formData) {
  try {
    // Send register details as a POST request
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      teamName: formData.teamName,
      teamCode: formData.teamCode,
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    
    if (response.data.success) {
      toast.success(response.data.message || 'Registered successfully!');
      return response.data;
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
    toast.error(errorMsg);
    return null;
  }
}

export async function login(formData) {
  try {
    // Send login credentials as a POST request
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      teamName: formData.teamName,
      email: formData.email,
      password: formData.password,
      teamCode: formData.teamCode
    });
    
    if (response.data.success) {
      // Store token and details in Local Storage
      const { token, team, member } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('teamName', team.teamName);
      if (member) {
        localStorage.setItem('userName', member.userName);
        localStorage.setItem('userEmail', member.email);
      }
      
      toast.success(response.data.message || 'Logged in successfully!');
      return response.data;
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
    toast.error(errorMsg);
    return null;
  }
}