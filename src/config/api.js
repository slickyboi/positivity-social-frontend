import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: 'https://positivity-social-backend.onrender.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    config => {
        // Log the request
        console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => {
        console.log('Response received:', response.status);
        return response;
    },
    error => {
        if (!error.response) {
            console.error('Network error: No response from server');
            return Promise.reject(new Error('Network error: Unable to reach the server. Please try again later.'));
        }
        console.error('Response error:', error.response.status, error.response.data);
        return Promise.reject(error);
    }
);

export default api;
