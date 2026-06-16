import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },
};
