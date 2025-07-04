import axios from 'axios';
import {
  BarData,
  MismatchesLevelChart,
  MismatchesResponse,
  SigmaRule,
} from '../types/default';
import { NetworkEvent } from '../types/event_logs';
import { LogData } from '../types/default_chart';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchBarTableList = async (
  log_id: string
): Promise<NetworkEvent> => {
  try {
    const response = await api.get(`/agent/elastic/logs/${log_id}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error;
  }
};

export const fetchMismatchesTable = async (
  page?: number,
  pageSize?: number
): Promise<MismatchesResponse> => {
  try {
    const params = {
      ...(page && { page }),
      ...(pageSize && { page_size: pageSize }),
    };
    const response = await api.get('/elastic/mismatches/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching mismatches:', error);
    throw error;
  }
};

export const fetchMismatchesLog = async (
  log_id: string
): Promise<NetworkEvent> => {
  try {
    const response = await api.get(`/agent/elastic/logs/${log_id}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error;
  }
};

export const fetchMismatchesRule = async (id: string): Promise<SigmaRule> => {
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

export const fetchBarListTable = async (id: number): Promise<LogData> => {
  try {
    const response = await api.get(`/elastic/mitra-tags/${id}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error;
  }
};

export const fetchBarRiskList = async (): Promise<DeviceRiskBar[]> => {
  try {
    const response = await api.get('/elastic/device-risk-summary/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};

export const fetchBarRiskListTable = async (
  id: number
): Promise<DeviceRiskList> => {
  try {
    const response = await api.get(`/elastic/device-risk-detail/${id}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error;
  }
};

export interface DeviceRiskBar {
  device_id: number;
  device_name: string;
  total_risk: number;
}

export interface DeviceRiskList {
  id: number;
  risk_ball: number;
  threat_indicator: string;
  example: string;
  created_at: string;
}
