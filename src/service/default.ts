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

export type LogData = {
  tag_id: number;
  tag: string;
  log_count: number;
  logs: LogItem[];
};

export type LogItem = {
  id: string;
  EventId: number;
  Event: EventDetails;
};

export type EventDetails = {
  EventHeader: EventHeader;
  'Task Name': string;
  RuleName: string;
  UtcTime: string;
  ProcessGuid: string;
  ProcessId: string;
  Image: string;
  FileVersion: string;
  Description: string;
  Product: string;
  Company: string;
  OriginalFileName: string;
  CommandLine: string;
  CurrentDirectory: string;
  User: string;
  LogonGuid: string;
  LogonId: string;
  TerminalSessionId: number;
  IntegrityLevel: string;
  Hashes: string;
  ParentProcessGuid: string;
  ParentProcessId: string;
  ParentImage: string;
  ParentCommandLine: string;
  ParentUser: string;
};

export type EventHeader = {
  Size: number;
  HeaderType: number;
  Flags: number;
  EventProperty: number;
  ThreadId: number;
  ProcessId: number;
  TimeStamp: number;
  ProviderId: string;
  EventDescriptor: EventDescriptor;
  KernelTime: number;
  UserTime: number;
  ActivityId: string;
};

export type EventDescriptor = {
  Id: number;
  Version: number;
  Channel: number;
  Level: number;
  Opcode: number;
  Task: number;
  Keyword: string;
};
