import axios from 'axios';

// Configure axios to use the backend API URL
const API_URL = 'https://positivity-social-backend.onrender.com';
console.log('Using API URL:', API_URL);

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Configure axios defaults
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Helper function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Add request interceptor for debugging
api.interceptors.request.use(
    config => {
        console.log('Making request to:', config.url);
        // Add retry count to config if not present
        if (config.retry === undefined) {
            config.retry = 0;
        }
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
    async error => {
        const config = error.config;
        
        // Only retry on specific error conditions
        if (
            error.response?.status === 429 || // Rate limit exceeded
            error.response?.status === 503 || // Service unavailable
            !error.response // Network error
        ) {
            // Check if we should retry
            if (config.retry < MAX_RETRIES) {
                config.retry += 1;
                console.log(`Retrying request (${config.retry}/${MAX_RETRIES})...`);
                
                // Wait before retrying
                await delay(RETRY_DELAY * config.retry);
                
                // Retry the request
                return api(config);
            }
        }

        // Log the error details
        if (error.response) {
            console.error('Response Error:', {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error('Request Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
