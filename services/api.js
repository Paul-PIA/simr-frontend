import axios from 'axios';
import { csrfToken } from './jwt';


const LOCAL_URL = 'http://127.0.0.1:8000/api';
const SERVER_URL = '/api'; // fill in this url with your adress of backend server 

const API_URL = SERVER_URL; // switch LOCAL_URL or SERVER_URL to adapt the environment 

axios.defaults.withCredentials = true;

export const apiClient = async ({ method, path, data }) => { //Voir plus bas pour les cas particuliers
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

export const apiClientNotoken = async ({ method, path, data }) => { //A utiliser quand on n'a pas de token, par exemple pour créer un compte
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

export const apiClientGetoken = async ({ data }) => { //A utiliser pour récupérer les 2 tokens depuis le backend
    const url = `${API_URL}/token/`;
    try {
        const response = await axios({ method:'POST', url, headers: {
            'X-CSRFToken': csrfToken
        }, data });
        const { refresh, access } = response.data;  // Récupère les tokens
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        return response.data;
    } catch (error) {
        console.error(`Failed:`, error);
        throw error;
    }
};

export const apiClientGetFile = async ({ path}) => { //A utiliser pour récupérer les fichiers Excel depuis le backend
    const url =(new URL(path)).pathname;
    const token = localStorage.getItem('access');
    try {
        const response = await axios({ method:'GET', url, headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRFToken': csrfToken,
            "Content-Type": "multipart/form-data",
        }, responseType: 'arraybuffer', });
        return response.data;
    } catch (error) {
        console.error(`Failed:`, error);
        throw error;
    }
};

export const apiRefresh=async()=>{ //A utiliser pour refresh le token d'accès
    try {
        const response=await apiClient({
            method:'POST',
            path:'token/refresh/',
            data:{refresh:localStorage.refresh}
        });
        localStorage.setItem('access',response.access)
    }
    catch(error){
        window.location='/auth'
    }
}