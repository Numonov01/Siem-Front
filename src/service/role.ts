import axios from 'axios';
import { UserRoleData } from '../types/user_role';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchRole = async (): Promise<UserRoleData[]> => {
  try {
    const response = await api.get('/agent/sigma-rules/');
    return response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching event logs:', error);
    throw error;
  }
};
