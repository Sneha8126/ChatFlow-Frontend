import api from './api';

export const messageService = {
  getMessages: (conversationId, page = 1, limit = 30) =>
    api
      .get(`/messages/${conversationId}?page=${page}&limit=${limit}`)
      .then((r) => r.data),
  send: (data) => api.post('/messages', data).then((r) => r.data),
  markAsRead: (id) => api.put(`/messages/${id}/read`).then((r) => r.data),
  remove: (id) => api.delete(`/messages/${id}`).then((r) => r.data),
  react: (id, emoji) => api.put(`/messages/${id}/reaction`, { emoji }).then((r) => r.data),
};
