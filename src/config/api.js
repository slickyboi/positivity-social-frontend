import axios from 'axios';

const api = axios.create({
    baseURL: 'https://positivity-social-backend.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor
api.interceptors.request.use(
    config => {
        // Add CORS headers to the request
        config.headers = {
            ...config.headers,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        };
        return config;
    },
    error => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
    response => response,
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
