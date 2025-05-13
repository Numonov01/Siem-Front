import axios from 'axios';
import { Device, DeviceListData } from '../types/device_list';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchDeviceList = async (): Promise<DeviceListData[]> => {
  try {
    const response = await api.get('/agent/device/list/');
    return response.data;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};

export const fetchDeviceAppsList = async (pk: number): Promise<Device> => {
  try {
    const response = await api.get(`/agent/device/${pk}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device apps:', error);
    throw error;
  }
};
