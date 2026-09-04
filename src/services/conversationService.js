import api from './api';

export const conversationService = {
  getAll: () => api.get('/conversations').then((r) => r.data),
  create: (userId) => api.post('/conversations', { userId }).then((r) => r.data),
  getById: (id) => api.get(`/conversations/${id}`).then((r) => r.data),
};
