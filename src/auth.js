import axios from 'axios';

const API_Url = process.env.DJANGO_API_URL || "https://backend-production-207b.up.railway.app/api/";

export const login = async (username, password) => {
    const response = await axios.post(`${API_Url}auth/token/login/`, {
        username,
        password
    });
    localStorage.setItem('authToken', response.data.auth_token);
    return response.data;
};

export const register = async (username, password, email) => {
    const response = await axios.post(`${API_Url}auth/users/`, {
        username,
        password,
        email
    });
    return response.data;
};

export const logout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        await axios.post(`${API_Url}auth/token/logout/`, {}, {
            headers: { Authorization: `Token ${token}` }
        });
        localStorage.removeItem('authToken');
    }
};

export const getAuthToken = () => localStorage.getItem('authToken');
