import axios from 'axios';
import { BarData } from '../types/default';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchBarList = async (): Promise<BarData[]> => {
  try {
    const response = await api.get('/elastic/mitra-tags/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};
