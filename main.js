
//Complementos, funciones, utilidades .etc 
import { initVariales,  } from "./src/config/variables.js";
import { initSweetAlert } from "./src/config/sweetalert.js";
import { configPopUpButton } from "./src/components/MenuActions.js";




const configButtons = () => {
    //Configuracion del Popup del boton de configuracion
    configPopUpButton();
}

/***
 * Configuración inicial de la aplicación
 */
const ConfiguracionInicial = () => {

    // Inicializar variables globales
    initVariales();

    // Configurar SweetAlert2 con estilos globales
    initSweetAlert();

    // Configuracion de acciones de botones
    configButtons();

}

/**
 * Evento DOMContentLoaded
 */
window.addEventListener("DOMContentLoaded", () => {

    //1. Configuración inicial
    ConfiguracionInicial();

});