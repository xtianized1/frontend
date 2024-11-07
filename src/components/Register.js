import React, { useState } from 'react';
import { register } from '../auth';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(username, password, email);
            setUsername('');
            setEmail('');   
            setPassword('');
            setMessage('Registration successful. You can now log in.');
        } catch (err) {
            setMessage('Registration failed.', err);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            {message && <p>{message}</p>}
            <input
                
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;