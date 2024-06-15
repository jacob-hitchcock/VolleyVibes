import React,{ useContext,useEffect,useState } from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = () => {
    const { auth } = useContext(AuthContext);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        if(auth.user !== null) {
            setLoading(false);
        }
    },[auth]);

    if(loading) {
        return <div>Loading...try logging back in.</div>;
    }

    return auth.user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
