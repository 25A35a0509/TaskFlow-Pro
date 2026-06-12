import api from './api';

export const activityService = {
  getActivityLogs: async (limit = 20) => {
    const res = await api.get('/activity', { params: { limit } });
    return res.data;
  },
};
