import React,{ useContext,useEffect,useState } from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';

const ProtectedRoute = () => {
    const { auth } = useContext(AuthContext);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        if(auth.user !== null) {
            setLoading(false);
        }
    },[auth]);

    if(loading) {
        return (
            <LoginPage />
        );
    }

    return auth.user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
