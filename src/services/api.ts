import axios, { AxiosInstance } from 'axios';
import { LoginCredentials, AuthResponse, ApiResponse } from '@/src/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Handle responses
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Logout on unauthorized
          if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Mock Login - for development without backend
  private mockLogin(credentials: LoginCredentials): AuthResponse | null {
    const demoCredentials = {
      email: 'admin@maleosan.com',
      password: 'password123',
    };

    if (
      credentials.email === demoCredentials.email &&
      credentials.password === demoCredentials.password
    ) {
      return {
        token: 'mock_token_' + Date.now(),
        user: {
          id: '1',
          name: 'Admin Maleosan',
          email: credentials.email,
          role: 'super_admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }
    return null;
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Try mock login first for development
    const mockResponse = this.mockLogin(credentials);
    if (mockResponse) {
      return mockResponse;
    }

    // If not mock credentials, try real API
    try {
      const response = await this.client.post<ApiResponse<AuthResponse>>(
        '/auth/login',
        credentials
      );
      return response.data.data as AuthResponse;
    } catch (error: any) {
      // If API fails and not mock credentials, throw error
      throw error;
    }
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.client.get('/auth/me');
    return response.data.data;
  }

  // Hotels endpoints
  async getHotels(page = 1, limit = 10, search = '') {
    const response = await this.client.get('/hotels', {
      params: { page, limit, search },
    });
    return response.data.data;
  }

  async getHotel(id: string) {
    const response = await this.client.get(`/hotels/${id}`);
    return response.data.data;
  }

  async createHotel(data: any) {
    const response = await this.client.post('/hotels', data);
    return response.data.data;
  }

  async updateHotel(id: string, data: any) {
    const response = await this.client.put(`/hotels/${id}`, data);
    return response.data.data;
  }

  async deleteHotel(id: string) {
    await this.client.delete(`/hotels/${id}`);
  }

  // Transport endpoints
  async getTransports(page = 1, limit = 10, search = '') {
    const response = await this.client.get('/transports', {
      params: { page, limit, search },
    });
    return response.data.data;
  }

  async getTransport(id: string) {
    const response = await this.client.get(`/transports/${id}`);
    return response.data.data;
  }

  async createTransport(data: any) {
    const response = await this.client.post('/transports', data);
    return response.data.data;
  }

  async updateTransport(id: string, data: any) {
    const response = await this.client.put(`/transports/${id}`, data);
    return response.data.data;
  }

  async deleteTransport(id: string) {
    await this.client.delete(`/transports/${id}`);
  }

  // Paket Tour endpoints
  async getPaketTours(page = 1, limit = 10, search = '') {
    const response = await this.client.get('/paket-tours', {
      params: { page, limit, search },
    });
    return response.data.data;
  }

  async getPaketTour(id: string) {
    const response = await this.client.get(`/paket-tours/${id}`);
    return response.data.data;
  }

  async createPaketTour(data: any) {
    const response = await this.client.post('/paket-tours', data);
    return response.data.data;
  }

  async updatePaketTour(id: string, data: any) {
    const response = await this.client.put(`/paket-tours/${id}`, data);
    return response.data.data;
  }

  async deletePaketTour(id: string) {
    await this.client.delete(`/paket-tours/${id}`);
  }

  // Booking endpoints
  async getBookings(page = 1, limit = 10, status = '', search = '') {
    const response = await this.client.get('/bookings', {
      params: { page, limit, status, search },
    });
    return response.data.data;
  }

  async getBooking(id: string) {
    const response = await this.client.get(`/bookings/${id}`);
    return response.data.data;
  }

  async updateBookingStatus(id: string, status: string) {
    const response = await this.client.patch(`/bookings/${id}/status`, { status });
    return response.data.data;
  }

  // Media endpoints
  async uploadMedia(file: File, folder?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await this.client.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  async getMediaFiles(page = 1, limit = 20, folder = '') {
    const response = await this.client.get('/media', {
      params: { page, limit, folder },
    });
    return response.data.data;
  }

  async deleteMedia(id: string) {
    await this.client.delete(`/media/${id}`);
  }

  // Dashboard endpoints
  async getDashboardStats() {
    try {
      const response = await this.client.get('/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.warn('Using mock dashboard stats (API unavailable)');
      return {
        totalHotels: 12,
        totalTransports: 8,
        totalPaketTours: 15,
        totalBookings: 48,
        totalRevenue: 125000000,
        totalCustomers: 156,
      };
    }
  }

  async getDashboardCharts() {
    try {
      const response = await this.client.get('/dashboard/charts');
      return response.data.data;
    } catch (error) {
      console.warn('Using mock dashboard charts (API unavailable)');
      return {
        salesData: [
          { month: 'Jan', revenue: 4000 },
          { month: 'Feb', revenue: 3000 },
          { month: 'Mar', revenue: 2000 },
          { month: 'Apr', revenue: 2780 },
          { month: 'May', revenue: 1890 },
          { month: 'Jun', revenue: 2390 },
        ],
        bookingTrendData: [
          { date: '1-7', bookings: 24 },
          { date: '8-14', bookings: 13 },
          { date: '15-21', bookings: 98 },
          { date: '22-28', bookings: 39 },
        ]
      };
    }
  }
}

export const apiClient = new ApiClient();
