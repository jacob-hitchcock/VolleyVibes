// src/context/AuthContext.js
import React,{ createContext,useState,useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth,setAuth] = useState({ user: null });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axiosInstance.get('/users/check-auth');
                if(response.data.user) {
                    console.log('User authenticated:',response.data.user);
                    setAuth({ user: response.data.user });
                } else {
                    console.log('No user authenticated');
                }
            } catch(error) {
                console.error('Auth check failed:',error.response ? error.response.data : error.message);
            }
        };
        checkAuth();
    },[]);

    const login = async (email,password) => {
        try {
            console.log("Sending login request to backend");
            const loginResponse = await axiosInstance.post('/users/login',{ email,password });
            const token = loginResponse.data.token;

            // Set token in a cookie
            document.cookie = `token=${token}; path=/; secure=${process.env.NODE_ENV === 'production'}`;
            console.log('Token set in cookie:',token);

            // Manually set the Authorization header for subsequent requests
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const checkAuthResponse = await axiosInstance.get('/users/check-auth');
            if(checkAuthResponse.data.user) {
                console.log('Login successful:',checkAuthResponse.data.user);
                setAuth({ user: checkAuthResponse.data.user });
                return true;
            } else {
                console.log('Login check-auth failed');
                return false;
            }
        } catch(error) {
            console.error('Login failed:',error.response ? error.response.data : error.message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/users/logout');
            setAuth({ user: null });
            console.log('Logout successful');
        } catch(error) {
            console.error('Logout failed:',error.response ? error.response.data : error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ auth,login,logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
