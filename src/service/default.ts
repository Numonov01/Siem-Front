import axios from 'axios';
import {
  BarData,
  MismatchesLevelChart,
  MismatchesResponse,
  SigmaRule,
} from '../types/default';
import { NetworkEvent } from '../types/event_logs';

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

export const fetchMismatchesTable = async (): Promise<MismatchesResponse[]> => {
  try {
    const response = await api.get('/elastic/mismatches/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};

export const fetchMismatchesLog = async (id: number): Promise<NetworkEvent> => {
  try {
    const response = await api.get(`/agent/elastic/logs/${id}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error;
  }
};

export const fetchMismatchesRule = async (id: number): Promise<SigmaRule> => {
  try {
    const response = await api.get(`/agent/sigma-rule/${id}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error;
  }
};

export const fetchMismatchesChart = async (): Promise<
  MismatchesLevelChart[]
> => {
  try {
    const response = await api.get('/elastic/sigma-mismatches/level-chart/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};
