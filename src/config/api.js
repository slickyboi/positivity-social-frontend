import axios from 'axios';

const api = axios.create({
    baseURL: 'https://positivity-social-backend.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor
api.interceptors.request.use(
    config => {
        console.log('Request URL:', config.url);
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
    }
);

export default api;
