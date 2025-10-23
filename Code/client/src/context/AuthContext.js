import React,{ createContext,useState,useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth,setAuth] = useState({ user: null });

    const login = async (email,password) => {
        try {
            const response = await axiosInstance.post('/users/login',{ email,password },{ withCredentials: true });
            const { user,token } = response.data;

            document.cookie = `token=${token}; path=/; secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict`;

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
        } catch(error) {
            console.error('Logout failed:',error.response ? error.response.data : error.message);
        }
    };

    const checkAuth = async () => {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;

        if(!token) {
            console.log('No auth token found - skipping auth check')
            return;
        }

            try {
                const response = await axiosInstance.get('/users/me',{ withCredentials: true });
                setAuth({ user: response.data.user });
            } catch(error) {
                console.error('Auth check failed:',error.response ? error.response.data : error.message);
            } 
    };

    useEffect(() => {
        checkAuth();
    },[]);

    return (
        <AuthContext.Provider value={{ auth,login,logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
