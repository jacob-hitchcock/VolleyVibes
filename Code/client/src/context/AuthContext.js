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
            await axiosInstance.post('/users/login',{ email,password });
            const response = await axiosInstance.get('/users/check-auth');
            if(response.data.user) {
                console.log('Login successful:',response.data.user);
                setAuth({ user: response.data.user });
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