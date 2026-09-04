import api from './api';

export const userService = {
  search: (q) => api.get(`/users/search?q=${encodeURIComponent(q)}`).then((r) => r.data),
  getById: (id) => api.get(`/users/${id}`).then((r) => r.data),
  updateProfile: (data) => api.put('/users/profile', data).then((r) => r.data),
  changePassword: (data) => api.put('/users/password', data).then((r) => r.data),
};
