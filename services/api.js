import axios from 'axios';
import { getToken } from './jwt';

const LOCAL_URL = 'http://127.0.0.1:8000/api';
const SERVER_URL = ''; // fill in this url with your adress of backend server 

const API_URL = LOCAL_URL; // switch LOCAL_URL or SERVER_URL to adapt the environment 

export const apiClient = async ({ method, path, data }) => {
    const url = `${API_URL}/${path}`;
    const token = getToken();
    try {
        const response = await axios({ method, url, headers: {
            Authorization: `Bearer ${token}`
        }, data });
        return response.data;
    } catch (error) {
        console.error(`Failed:`, error);
        throw error;
    }
};