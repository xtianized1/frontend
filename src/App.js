import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Autocomplete from './components/Autocomplete';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import { getAuthToken } from './auth';

function App() {
    const [isAuthenticated, setAuthenticated] = useState(!!getAuthToken());
    const [username, setUsername] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const API_Url = process.env.DJANGO_API_URL || "https://backend-production-207b.up.railway.app/api/";

    const handleLogin = (user) => {
        setAuthenticated(true);
        setUsername(user);
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = getAuthToken();
            if (token) {
                try {
                    const response = await axios.get(`${API_Url}auth/users/me/`, {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    setUsername(response.data.username);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        if (isAuthenticated) {
            fetchUserDetails();
        }
    }, [isAuthenticated, API_Url]);

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };
    
    return (
        <div className="App">
            <h1>Staged Book-Autocomplete</h1>
            {isAuthenticated && <h2>Welcome, {username}!</h2>}
            {!isAuthenticated ? (
                <div>
                    {isRegistering ? (
                        <Register toggleForm={toggleForm} />
                    ) : (
                        <Login setAuthenticated={handleLogin} toggleForm={toggleForm} />
                    )}
                    <button onClick={toggleForm}>
                        {isRegistering ? 'Go to Login' : 'Go to Sign Up'}
                    </button>
                </div>
            ) : (
                <div>
                    <Logout setAuthenticated={setAuthenticated} />
                    <Autocomplete />
                </div>
            )}
        </div>
    );
}

export default App;
