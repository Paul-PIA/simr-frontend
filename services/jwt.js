import axios from "axios";

export const setToken = token => {
    localStorage.setItem('token', token);
};
export const getToken = () => {
    localStorage.getItem('access');
};
export const clearToken = () => {
    localStorage.removeItem('token');
};

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Vérifie si le cookie commence par le nom donné
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



// Fonction pour récupérer et définir le token CSRF
export const fetchCsrfToken = async () => {
    try {
        // On peut effectuer un appel pour s'assurer que le token est bien envoyé
        await axios.get('https://simr-xxm0.onrender.com/set-csrf-token', { withCredentials: true });
        
        // Récupère le token CSRF à partir du cookie
        const csrfToken = getCookie('csrftoken');
        
        if (csrfToken) {
            console.log('CSRF Token fetched:', csrfToken);
            return csrfToken; // Renvoie le token pour l'utiliser dans une autre page
        } else {
            console.error('CSRF Token not found in cookies');
        }
    } catch (error) {
        console.error('Failed to get CSRF Token', error);
    }
};

export const csrfToken=await fetchCsrfToken()
console.log(csrfToken)