import axios from 'axios';
import { getToken, csrfToken } from './jwt';


const LOCAL_URL = 'http://127.0.0.1:8000/api';
const SERVER_URL = 'https://simr-xxm0.onrender.com/api'; // fill in this url with your adress of backend server 

const API_URL = SERVER_URL; // switch LOCAL_URL or SERVER_URL to adapt the environment 

axios.defaults.withCredentials = true;

export const apiClient = async ({ method, path, data }) => {
    const url = `${API_URL}/${path}`;
    const token = getToken();
    try {
        const response = await axios({ method, url, headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRFToken': csrfToken
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
            'X-CSRFToken': csrfToken
        }, data });
        return response.data;
    } catch (error) {
        console.error(`Failed:`, error);
        throw error;
    }
};