// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true, // Include credentials in requests
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('Axios error:',error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;