import axios from 'axios';
import { csrfToken } from './jwt';

//Ce fichier contient toutes les fonctions permettant d'interagir via l'API avec le backend.
//Se référer au fichier Excel 'API documentation' pour plus de détails sur les requêtes elles-même

const LOCAL_URL = 'http://127.0.0.1:8000/api';
const SERVER_URL = '/api';
//Avec les règles redirect/rewrite, les requêtes s'adressent au serveur frontend qui les renvoie au serveur backend

const API_URL = SERVER_URL; // switch LOCAL_URL or SERVER_URL to adapt the environment 

axios.defaults.withCredentials = true;

/**
 * Méthode principale pour communiquer avec le backend.
 * @param {Object} param0 
 * @param {string} param0.method - Méthodes possibles : 'GET', 'POST', 'PATCH', 'PUT'
 * @param {string} param0.path - Chemin relatif de la requête depuis 'backendurl.com/api'
 * @param {Object} param0.data - Données transmises au backend
 * @returns {Promise<Object>} - Données renvoyées par le backend
 * @throws {Error} - Lance une erreur si la requête échoue.
 */
export const apiClient = async ({ method, path, data }) => { //Voir plus bas pour les cas particuliers d'usage de l'API
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

/**
 * Méthode pour communiquer avec le backend quand on ne dispose pas de token d'authentification.
 * @param {Object} param0 
 * @param {string} param0.method - Méthodes possibles : 'GET', 'POST', 'PATCH', 'PUT'
 * @param {string} param0.path - Chemin relatif de la requête depuis 'backendurl.com/api'
 * @param {Object} param0.data - Données transmises au backend
 * @returns {Promise<Object>} - Données renvoyées par le backend
 * @throws {Error} - Lance une erreur si la requête échoue.
 */
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

/**
 * Récupère les tokens d'accès et de refresh auprès du backend et les stocke dans le localStorage
 * @param {Object} param0
 * @param {Object} param0.data
 * @param {string} param0.data.username - Nom d'utilisateur
 * @param {string} param0.data.password - Mot de passe
 * @throws {Error} - Lance une erreur si la requête échoue.
 */
export const apiClientGetoken = async ({ data }) => {
    const url = `${API_URL}/token/`;
    try {
        const response = await axios({ method:'POST', url, headers: {
            'X-CSRFToken': csrfToken
        }, data });
        const { refresh, access } = response.data;  // Récupère les tokens
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
    } catch (error) {
        console.error(`Failed:`, error);
        throw error;
    }
};
/**
 * 
 * Récupère un fichier Excel depuis le backend sous forme de `ArrayBuffer`.
 * 
 * Cette fonction effectue une requête HTTP GET vers une URL spécifiée pour télécharger un fichier. 
 * Elle est configurée pour gérer les fichiers compressés renvoyés par le backend, en définissant le 
 * type de réponse (`responseType`) à `arraybuffer`.
 * 
 * @param {Object} param0 - Les paramètres pour la requête.
 * @param {string} param0.path - Le chemin ou l'URL complète du fichier à récupérer.
 * @returns {Promise<ArrayBuffer>} - Renvoie les données du fichier sous forme de `ArrayBuffer`.
 * @throws {Error} - Lance une erreur si la requête échoue.
 */
export const apiClientGetFile = async ({ path}) => {
    const url =(new URL(path)).pathname;
    const token = localStorage.getItem('access');
    try {
        const response = await axios({ method:'GET', url, headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRFToken': csrfToken,
            "Content-Type": "multipart/form-data"
        }, responseType: 'arraybuffer' }); //responseType permet de dire au backend de renvoyer un fichier compressé
        return response.data;
    } catch (error) {
        console.error(`Failed:`, error);
        throw error;
    }
};


/**
 * Refresh le token d'accès. Peut prendre en argument une fonction qui s'éxécute en cas de succès
 * En cas d'échec, redirige vers la page de connexion
 * @param {function} onSuccess - S'éxécute en cas de succès
 */
export const apiRefresh=async(onSuccess)=>{
    //OnS
    try {
        const response=await apiClient({
            method:'POST',
            path:'token/refresh/',
            data:{refresh:localStorage.refresh}
        });
        localStorage.setItem('access',response.access);
        if (onSuccess){
            onSuccess()
        }
    }
    catch(error){
        location='/auth'
    }
}