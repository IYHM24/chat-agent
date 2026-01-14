
//Complementos, funciones, utilidades .etc 
import { initVariales,  } from "./src/config/variables.js";
import { initSweetAlert } from "./src/config/sweetalert.js";
import { configPopUpButton } from "./src/components/MenuActions.js";
import AgentService from "./src/services/AgentService.js";
import { showLoadingIndicator, hideLoadingIndicator, renderMessages } from "./src/components/ComponentesFormulario.js";



const configButtons = () => {

    //Configuracion del Popup del boton de configuracion
    configPopUpButton();
    
}

/**
 * Inicializar el chat del agente
 */
const initAgentChat = async () => {
    try {
        // Mostrar indicador de carga
        showLoadingIndicator();

        // Configurar el chat del agente
        const messages = await AgentService.configChat();

        // Ocultar indicador de carga
        hideLoadingIndicator();

        // Renderizar mensajes iniciales
        renderMessages(messages);
    } catch (error) {
        console.error("Error al inicializar el chat:", error);
        hideLoadingIndicator();
    }
}

/***
 * Configuración inicial de la aplicación
 */
const ConfiguracionInicial = () => {

    // Inicializar variables globales
    initVariales();

    // Configurar SweetAlert2 con estilos globales
    initSweetAlert();

    //Inicializar el servicio del agente
    AgentService.run();

    // Configuracion de acciones de botones
    configButtons();

    // Inicializar el chat del agente
    initAgentChat();

}

/**
 * Evento DOMContentLoaded
 */
window.addEventListener("DOMContentLoaded", () => {

    //1. Configuración inicial
    ConfiguracionInicial();

});