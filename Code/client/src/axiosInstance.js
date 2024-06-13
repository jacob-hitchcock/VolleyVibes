// src/axiosInstance.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Include credentials in requests
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];
        if(token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Axios error:',error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
