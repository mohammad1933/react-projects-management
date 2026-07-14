import apiClient from './axios';

// Each function maps to one backend endpoint
export const authService = {
  register: (data) =>
    apiClient.post('/register', data),

  login: (data) =>
    apiClient.post('/login', data),

  verifyOtp: (data) =>
    apiClient.post('/verify-otp', data),

  resendVerification: (email) =>
    apiClient.post('/resend-verification', { email }),

  logout: () =>
    apiClient.post('/logout'),

  getUser: () =>
    apiClient.get('/user'),

  toggleTwoFactor: () =>
    apiClient.post('/2fa/toggle'),
  invitations:() => apiClient.get("/user-invitations"),
  approveProject:(pid) => apiClient.post(`/approve-project-invitation/${pid}`),
  declineProject:(pid) => apiClient.post(`/decline-project-invitation/${pid}`),
};