import axios from 'axios';

// Configure axios to use the backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log('Using API URL:', API_URL); // Debug log

// Configure axios defaults
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false // Disable credentials for now
});

// Add request interceptor for debugging
api.interceptors.request.use(
    config => {
        console.log('Making request to:', config.url);
        console.log('Request config:', config);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    response => {
        console.log('Received response:', response);
        return response;
    },
    error => {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        return Promise.reject(error);
    }
);

export default api;
