import axios from 'axios';
import { NetworkEventResponse } from '../types/event_logs';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchEventLogs = async (
  page = 1,
  pageSize = 10
): Promise<NetworkEventResponse[]> => {
  try {
    const response = await api.get('/agent/elastic/logs/', {
      params: {
        page,
        page_size: pageSize,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching event logs:', error);
    throw error;
  }
};
