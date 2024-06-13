import React,{ createContext,useState,useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth,setAuth] = useState({ user: null });

    const login = async (email,password) => {
        try {
            console.log("Sending login request to backend");
            const response = await axiosInstance.post('/users/login',{ email,password },{ withCredentials: true });
            const { user,token } = response.data;

            document.cookie = `token=${token}; path=/; secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict`;
            console.log('Token set in cookie:',token);

            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setAuth({ user });
            return true;
        } catch(error) {
            console.error('Login failed:',error.response ? error.response.data : error.message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/users/logout',{},{ withCredentials: true });
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
