import { httpService } from "../config/fetch.js";
import { getTokenStorage } from "../config/localStorage.js";
import { localStorageKeys } from "../config/variables.js";

class AuthService {
    
    isLogged = () => {
        const token = getTokenStorage(localStorageKeys.tokenAuth);
        return token !== null;
    }

    /**
     * Login de usuario
     * @param {string} Usuario 
     * @param {string} Credencial 
     * @returns 
     */
    async login(Usuario, Credencial) {
        // Lógica de autenticación (simulada aquí)
        const response = await httpService.post('/auth/login', { Usuario, Credencial });
        return response.data;
    }

}

// Exportar una instancia de la clase
export default new AuthService();