import axios from 'axios';

// API Configuration
const config = {
    development: {
        baseURL: 'http://localhost:5000'
    },
    production: {
        baseURL: 'https://positivity-social-backend.onrender.com'
    }
};

const environment = process.env.NODE_ENV || 'development';
const API_BASE_URL = config[environment].baseURL;

console.log('Current environment:', environment);
console.log('Using API URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    config => {
        const fullUrl = `${config.baseURL}${config.url}`;
        console.log(`Making ${config.method.toUpperCase()} request to: ${fullUrl}`);
        console.log('Request data:', config.data);
        
        // Check if server is reachable
        return axios.get(`${config.baseURL}/health`)
            .then(() => config)
            .catch(error => {
                console.error('Server health check failed:', error.message);
                return config;
            });
    },
    error => {
        console.error('Request setup error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => {
        console.log(`Response received from ${response.config.url}:`, {
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        if (!error.response) {
            // Network error or server not responding
            console.error(`Network error for ${error.config?.url}:`, error.message);
            return Promise.reject(new Error('The server is not responding. It might be starting up - please try again in a minute.'));
        }

        // Log the error details
        console.error(`Error response from ${error.config?.url}:`, {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
        });

        // Return a user-friendly error message
        return Promise.reject(new Error(error.response?.data?.error || 'An error occurred. Please try again.'));
    }
);

export default api;
