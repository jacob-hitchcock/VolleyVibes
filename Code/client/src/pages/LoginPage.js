// src/pages/LoginPage.js
import React,{ useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Update this import
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate(); // Update to use useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Attempting to log in");
        const success = await login(email,password);
        if(success) {
            navigate('/protected'); // Update to use navigate
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;