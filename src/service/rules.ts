import axios from 'axios';
import { UserRuleData } from '../types/user_role';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Optional: Add token if needed
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const fetchRule = async (): Promise<UserRuleData[]> => {
  try {
    const response = await api.get('/agent/sigma-rules/');
    return response.data;
  } catch (error) {
    console.error('Error fetching rules:', error);
    throw error;
  }
};

// Accept FormData for file upload
export const createRule = async (ruleData: FormData): Promise<UserRuleData> => {
  try {
    const response = await api.post('/agent/sigma-rules/', ruleData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating rule:', error);
    throw error;
  }
};

export const updateRule = async (
  id: number,
  ruleData: Partial<UserRuleData>
): Promise<UserRuleData> => {
  try {
    const response = await api.patch(`/agent/sigma-rules/${id}/`, ruleData);
    return response.data;
  } catch (error) {
    console.error('Error updating rule:', error);
    throw error;
  }
};

export const deleteRule = async (id: number): Promise<void> => {
  try {
    await api.delete(`/agent/sigma-rules/${id}/`);
  } catch (error) {
    console.error('Error deleting rule:', error);
    throw error;
  }
};

// Optional: Fetch single rule
// export const getRuleById = async (id: number): Promise<UserRuleData> => {
//   try {
//     const response = await api.get(`/agent/sigma-rules/${id}/`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching rule by ID:', error);
//     throw error;
//   }
// };
