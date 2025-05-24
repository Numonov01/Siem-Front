import axios from 'axios';
import { EventData } from '../types/event_logs';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchEventLogs = async (): Promise<EventData[]> => {
  try {
    const response = await api.get('/agent/elastic/logs/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching event logs:', error);
    throw error;
  }
};
