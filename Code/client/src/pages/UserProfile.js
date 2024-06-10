// src/pages/UserProfile.js
import React from 'react';
import { Link,useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles.css';

function UserProfile() {
    const location = useLocation();

    // Example user profile, normally you would fetch this data from the server
    const user = {
        name: 'John Doe',
        age: 25,
        gender: 'Male',
        email: 'john.doe@example.com',
    };

    return (
        <div>
            <NavBar />
            <main className="bodycontent">
                <h2>User Profile</h2>
                <p>Name: {user.name}</p>
                <p>Age: {user.age}</p>
                <p>Gender: {user.gender}</p>
                <p>Email: {user.email}</p>
            </main>
            <footer>
                <p>Contact Information | Social Media Links | Terms of Service</p>
                <img src="/images/icon1.png" alt="icon1" />
                <img src="/images/icon2.png" alt="icon2" />
            </footer>
        </div>
    );
}

export default UserProfile;
