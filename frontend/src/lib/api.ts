import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Instance axios avec configuration par défaut
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et qu'on n'a pas déjà essayé de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Réessayer la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

// Nouveau type pour la réponse paginée
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  is_admin?: boolean;
  message: string;
}

export interface Profile {
  id: string;
  user: string;
  user_email: string;
  first_name: string;
  last_name: string;
  student_number?: string;
  year?: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  semester: number;
  document_type: 'examen' | 'td' | 'tp' | 'cours' | 'autre';
  file: string;
  file_url: string;
  file_name: string;
  uploaded_by: string;
  uploaded_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  year: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: string;
  room: string;
  professor: string;
  created_at: string;
  updated_at: string;
}

// API Functions

// Auth
export const register = (data: {
  email: string;
  username: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}) => api.post<AuthResponse>('/auth/register/', data);

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login/', { email, password });

export const logout = (refreshToken: string) =>
  api.post('/auth/logout/', { refresh_token: refreshToken });

export const getCurrentUser = () => api.get<{ user: User; is_admin: boolean }>('/auth/me/');

// Profiles
export const getProfiles = () => api.get<Profile[]>('/profiles/');
export const getMyProfile = () => api.get<Profile>('/profiles/me/');
export const updateProfile = (id: string, data: Partial<Profile>) =>
  api.patch<Profile>(`/profiles/${id}/`, data);

// Documents
export const getDocuments = (params?: { semester?: number; type?: string }) =>
  api.get<PaginatedResponse<Document>>('/documents/', { params });

export const uploadDocument = (formData: FormData) =>
  api.post<Document>('/documents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteDocument = (id: string) => api.delete(`/documents/${id}/`);

// Schedules
export const getSchedules = (year?: number) =>
  api.get<PaginatedResponse<Schedule>>('/schedules/', { params: year ? { year } : {} });

export const createSchedule = (data: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) =>
  api.post<Schedule>('/schedules/', data);

export const updateSchedule = (id: string, data: Partial<Schedule>) =>
  api.patch<Schedule>(`/schedules/${id}/`, data);

export const deleteSchedule = (id: string) => api.delete(`/schedules/${id}/`);

export const downloadDocument = (id: string) =>
  api.get(`/documents/${id}/download/`, {
    responseType: 'blob',  // ← Important pour les fichiers binaires
  });