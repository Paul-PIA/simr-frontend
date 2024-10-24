import axios from 'axios';
import { csrfToken } from './jwt';


const LOCAL_URL = 'http://127.0.0.1:8000/api';
const SERVER_URL = typeof window !=='undefined'?(window.location.origin+'/api'):'https://simr-xxm0.onrender.com/api'; // fill in this url with your adress of backend server 

const API_URL = SERVER_URL; // switch LOCAL_URL or SERVER_URL to adapt the environment 

axios.defaults.withCredentials = true;

export const apiClient = async ({ method, path, data }) => {
    const url = `${API_URL}/${path}`;
    const token = localStorage.getItem('access');
    try {
        const response = await axios({ method, url, headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRFToken': csrfToken,
            "Content-Type": "multipart/form-data"
        }, data });
        return response.data;
    } catch (error) {
        console.error(`Failed:`, error);
        throw error;
    }
};

export const apiClientNotoken = async ({ method, path, data }) => {
    const url = `${API_URL}/${path}`;
    try {
        const response = await axios({ method, url, headers: {
            'X-CSRFToken': csrfToken,
            'accept':'application/json'
        }, data });
        return response.data;
    } catch (error) {
        console.error(`Failed:`, error);
        throw error;
    }
};

export const apiClientGetoken = async ({ method, path, data }) => {
    const url = `${API_URL}/${path}`;
    try {
        const response = await axios({ method, url, headers: {
            'X-CSRFToken': csrfToken
        }, data });
        const { refresh, access } = response.data;  // Récupère les tokens
        console.log('Access Token:', access);
        console.log('Refresh Token:', refresh);
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        return response.data;
    } catch (error) {
        console.error(`Failed:`, error);
        throw error;
    }
};

export const apiClientGetFile = async ({ method, path, data }) => {
    const url = path;
    const token = localStorage.getItem('access');
    try {
        const response = await axios({ method, url, headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRFToken': csrfToken,
            "Content-Type": "multipart/form-data",
        }, data,  responseType: 'arraybuffer', });
        return response.data;
    } catch (error) {
        console.error(`Failed:`, error);
        throw error;
    }
};