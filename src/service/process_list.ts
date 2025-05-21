import axios from 'axios';
import { ProcessListData } from '../types/process_list';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchProcessList = async (
  id: string
): Promise<ProcessListData[]> => {
  try {
    const response = await api.get(`/agent/process-list/${id}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};
