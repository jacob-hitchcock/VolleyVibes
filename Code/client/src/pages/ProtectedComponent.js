// src/pages/ProtectedComponent.js
import React from 'react';
import LogoutButton from '../components/LogoutButton';

const ProtectedComponent = () => {
    return (
        <div>
            <h2>Protected Content</h2>
            <LogoutButton />
        </div>
    );
};

export default ProtectedComponent;