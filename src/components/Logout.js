import React from 'react';
import { logout } from '../auth';

const Logout = ({ setAuthenticated }) => {
    const handleLogout = async () => {
        await logout();
        setAuthenticated(false);
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
