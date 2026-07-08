import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach bearer token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials: any) => api.post('/login', credentials),
  getTokens: () => api.get('/tokens'),
  deleteTokens: () => api.delete('/tokens'),
};

export const heroApi = {
  getHero: () => api.get('/hero'),
  updateHero: (data: any) => api.put('/hero', data),
};

export const cvApi = {
  uploadCV: async (data: any) => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
    const response = await fetch(`${baseUrl}/cv`, {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    return response.json();
  }
};

export const skillsApi = {
  getSkills: () => api.get('/skills'),
  createSkill: (data: any) => api.post('/skills', data),
  updateSkill: (id: number, data: any) => api.put(`/skills/${id}`, data),
  deleteSkill: (id: number) => api.delete(`/skills/${id}`)
};

export const experienceApi = {
  getExperiences: (lang?: string) => api.get(`/experiences${lang ? `/${lang}` : ''}`),
  createExperience: (data: any) => api.post('/experiences', data),
  updateExperience: (id: number, data: any) => api.put(`/experiences/${id}`, data),
  deleteExperience: (id: number) => api.delete(`/experiences/${id}`)
};

export const projectApi = {
  getProjects: (lang?: string) => api.get(`/projects${lang ? `/${lang}` : ''}`),
  createProject: (data: any) => api.post('/projects', data),
  updateProject: (id: number, data: any) => api.put(`/projects/${id}`, data),
  deleteProject: (id: number) => api.delete(`/projects/${id}`),
  uploadImage: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
    const response = await fetch(`${baseUrl}/projects/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    const resData = await response.json();
    return { data: resData };
  }
};

export const blogApi = {
  getBlogs: (lang?: string) => api.get(`/blogs${lang ? `/${lang}` : ''}`),
  createBlog: (data: any) => api.post('/blogs', data),
  updateBlog: (id: number, data: any) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id: number) => api.delete(`/blogs/${id}`),
  uploadImage: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
    const response = await fetch(`${baseUrl}/blogs/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    const resData = await response.json();
    return { data: resData };
  }
};

export const contactApi = {
  submitMessage: (data: any) => api.post('/contacts', data),
  getMessages: () => api.get('/contacts'),
  updateMessage: (id: number, data: any) => api.put(`/contacts/${id}`, data),
  deleteMessage: (id: number) => api.delete(`/contacts/${id}`)
};

export default api;
