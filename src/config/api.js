import axios from 'axios';

// Configure axios to use the backend API URL
const API_URL = 'https://positivity-social-backend.onrender.com/api';
console.log('Using API URL:', API_URL); // Debug log

// Configure axios defaults
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
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
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response Error:', {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request Error:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
