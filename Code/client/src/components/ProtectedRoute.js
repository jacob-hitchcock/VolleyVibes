import React,{ useContext,useEffect,useState } from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProtectedRoute = () => {
    const { auth } = useContext(AuthContext);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        if(auth.user !== null) {
            setLoading(false);
        }
    },[auth]);

    if(loading) {
        return <div>Loading...try <Link to="/login" style={{ color: '#e7552b',textDecoration: 'underline' }}>logging back in</Link>.</div>;
    }

    return auth.user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
