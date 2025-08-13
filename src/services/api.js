import axios from "axios";
const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;


// OTP endpoints
export const sendOtp = (aadhaarNumber) =>
  axios.post(`${API_BASE}/otp/send`, { aadhaarNumber }).then(res => res.data);

export const verifyOtp = (aadhaarNumber, otp) =>
  axios.post(`${API_BASE}/otp/verify`, { aadhaarNumber, otp }).then(res => res.data);

// Registration submission
export const submitRegistration = (payload) =>
  axios.post(`${API_BASE}/registration`, payload).then(res => res.data);

// Optionally, fetching form schema if dynamic
export const getSchema = (params = {}) =>
  axios.get(`${API_BASE}/schema`, { params }).then(res => res.data);
