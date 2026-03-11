import axios from 'axios';

// IMPORTANT: This connects your React app to your Node.js backend!
const API_URL = 'http://3.239.186.138:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Calls for Authentication
export const authAPI = {
  adminLogin: (email, password) => api.post('/auth/admin/login', { email, password }),
  userLogin: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  resetPassword: (data) => api.put('/auth/password/reset', data),
};

// API Calls for Users
export const userAPI = {
  createUser: (userData) => api.post('/auth/users', userData),
  getAllUsers: (page = 1) => api.get('/auth/users', { params: { page } }),
  updateUser: (userId, userData) => api.put(`/auth/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/auth/users/${userId}`),
};

// API Calls for Patients
export const patientAPI = {
  createPatient: (patientData) => api.post('/patients', patientData),
  getUserPatients: (page = 1) => api.get('/patients/my-patients', { params: { page } }),
  getPatientById: (patientId) => api.get(`/patients/${patientId}`),
  updatePatient: (patientId, patientData) => api.put(`/patients/${patientId}`, patientData),
  deletePatient: (patientId) => api.delete(`/patients/${patientId}`),
 getAllPatients: (params) => api.get('/patients/all', { params }),
};

// API Calls for Assessments
export const assessmentAPI = {
  createAssessment: (patientId, assessmentData) => 
    api.post(`/assessments/patients/${patientId}/assessments`, assessmentData),
  getAssessmentById: (assessmentId) => api.get(`/assessments/${assessmentId}`),
  getPatientAssessments: (patientId, page = 1) => 
    api.get(`/assessments/patients/${patientId}/assessments`, { params: { page } }),
};

// API Calls for Dashboard (Admin)
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getDoctorStats: () => api.get('/dashboard/doctor-stats'),
  getUserDetails: (userId) => api.get(`/dashboard/users/${userId}/details`),
  
};
// Forgot Password API
export const forgotPasswordAPI = {
  requestOTP: async (identifier, method) => {
    const response = await fetch(`${API_URL}/auth/forgot-password/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, method })
    });
    return response.json();
  },
  
  verifyOTP: async (identifier, otp) => {
    const response = await fetch(`${API_URL}/auth/forgot-password/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp })
    });
    return response.json();
  },
  
  resetPassword: async (resetToken, newPassword, confirmPassword) => {
    const response = await fetch(`${API_URL}/auth/forgot-password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken, newPassword, confirmPassword })
    });
    return response.json();
  }
};
export default api;
