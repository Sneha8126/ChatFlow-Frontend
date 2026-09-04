import api from './api';

export const uploadService = {
  uploadFile: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api
      .post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) {
            onProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      })
      .then((r) => r.data);
  },
};
