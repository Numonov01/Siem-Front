import axios from 'axios';
import { LoginData } from '../types/login_data';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const AuthService = {
  async login(loginData: LoginData) {
    try {
      const response = await api.post<LoginData>('/auth/login/', loginData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      console.error('Unexpected login error:', error);
      throw new Error('An unexpected error occurred');
    }
  },
};
