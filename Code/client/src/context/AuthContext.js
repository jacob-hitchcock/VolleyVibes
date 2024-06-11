// src/context/AuthContext.js
import React,{ createContext,useState,useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import jwt from 'jsonwebtoken'; // You may need to install this package for decoding JWT

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth,setAuth] = useState({ user: null,token: null });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if(token && user) {
            setAuth({ token,user });
        }
    },[]);

    const login = async (email,password) => {
        try {
            console.log("Sending login request to backend");
            const response = await axiosInstance.post('/users/login',{ email,password });
            const { token } = response.data;
            const user = jwt.decode(token); // Decode token to get user info
            localStorage.setItem('token',token);
            localStorage.setItem('user',JSON.stringify(user));
            setAuth({ token,user });
            return true;
        } catch(error) {
            console.error('Login failed:',error.resopnse ? error.response.data : error.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({ user: null,token: null });
    };

    return (
        <AuthContext.Provider value={{ auth,login,logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;