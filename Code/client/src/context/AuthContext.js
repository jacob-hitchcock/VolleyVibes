import React,{ createContext,useState,useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { decode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth,setAuth] = useState({ user: null });
    const navigate = useNavigate();

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
            navigate('/login');
        } catch(error) {
            console.error('Logout failed:',error.response ? error.response.data : error.message);
        }
    };

    const checkAuth = async () => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if(token) {
            try {
                const response = await axiosInstance.get('/users/me',{ withCredentials: true });
                setAuth({ user: response.data.user });
            } catch(error) {
                console.error('Auth check failed:',error.response ? error.response.data : error.message);
            }
        }
    };

    const checkTokenExpiration = () => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if(token) {
            const decoded = decode(token.split('=')[1]);
            const currentTime = Date.now() / 1000; // in seconds
            if(decoded.exp < currentTime) {
                // Token is expired, log out the user
                logout();
            }
        }
    };

    useEffect(() => {
        checkAuth();
        checkTokenExpiration();
        const interval = setInterval(() => {
            checkTokenExpiration();
        },60000); // Check token expiration every 60 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    },[]);

    return (
        <AuthContext.Provider value={{ auth,login,logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
