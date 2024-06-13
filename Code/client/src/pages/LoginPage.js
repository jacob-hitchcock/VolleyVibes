import React,{ useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Attempting to log in"); // Log form submission
        const success = await login(email,password);
        if(success) {
            console.log("Navigation to protected route"); // Log navigation
            navigate('/protected');
        } else {
            console.log("Login failed, setting error"); // Log login failure
            setError('Invalid email or password');
        }
    };

    return (
        <div>
            <NavBar />
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            console.log("Email changed:",e.target.value); // Log email change
                            setEmail(e.target.value);
                        }}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            console.log("Password changed:",e.target.value); // Log password change
                            setPassword(e.target.value);
                        }}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
