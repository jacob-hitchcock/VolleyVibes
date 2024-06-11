// src/components/LogoutButton.js
import React,{ useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Update this import
import AuthContext from '../context/AuthContext';

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate(); // Update to use useNavigate

    const handleLogout = () => {
        logout();
        navigate('/login'); // Update to use navigate
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;