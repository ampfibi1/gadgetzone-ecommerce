import { create } from 'zustand';
import api from '../api/axios';

const getInitialUser = () => {
  try {
    const stored = localStorage.getItem('gadgetzone_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  token: localStorage.getItem('gadgetzone_token') || null,
  isAuthenticated: !!localStorage.getItem('gadgetzone_token'),
  isAdmin: getInitialUser()?.role === 'ADMIN',
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken } = response.data.data;

      localStorage.setItem('gadgetzone_token', accessToken);
      localStorage.setItem('gadgetzone_user', JSON.stringify(user));

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isAdmin: user.role === 'ADMIN',
        loading: false,
      });

      return { success: true, user };
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    }
  },

  register: async (name, email, password, phone) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/register', { name, email, password, phone });
      const { user, accessToken } = response.data.data;

      localStorage.setItem('gadgetzone_token', accessToken);
      localStorage.setItem('gadgetzone_user', JSON.stringify(user));

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isAdmin: false,
        loading: false,
      });

      return { success: true, user };
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors during logout
    }
    localStorage.removeItem('gadgetzone_token');
    localStorage.removeItem('gadgetzone_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  },

  fetchCurrentUser: async () => {
    const token = localStorage.getItem('gadgetzone_token');
    if (!token) return;

    try {
      const response = await api.get('/auth/me');
      const user = response.data.data.user;
      localStorage.setItem('gadgetzone_user', JSON.stringify(user));
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'ADMIN',
      });
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
      localStorage.removeItem('gadgetzone_token');
      localStorage.removeItem('gadgetzone_user');
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true });
    try {
      const response = await api.put('/auth/profile', profileData);
      const user = response.data.data.user;
      localStorage.setItem('gadgetzone_user', JSON.stringify(user));
      set({ user, loading: false });
      return { success: true, user };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
      };
    }
  },
}));
