import { initVariales, localStorageKeys } from "./src/config/variables.js";
import { initSweetAlert } from "./src/config/sweetalert.js";
import { settingsBtn } from "./src/components/ComponentesFormulario.js";
import { ModalAutenticacion } from "./src/modal/ModalAutenticacion.js";
import { ModalCargaDocumentos } from "./src/modal/ModalCargaDocumentos.js";
import { fixedData } from "./src/utils/fixedData.js";
import { setTokenAuth } from "./src/config/fetch.js";
import { ValidarProducto } from "./src/utils/excelValidator.js";
import { createMenuConfiguracion, closeMenuConfiguracion, isMenuOpen } from "./src/components/MenuConfiguracion.js";
import { removeTokenStorage } from "./src/config/localStorage.js";
import AuthService from "./src/services/AuthService.js";
import ExcelService from "./src/services/ExcelService.js";

// Ruta a la plantilla de Excel
const excelTemplate = "./Docs/python/Fortinet_Products.xlsx";



/**
 * Función principal del menú
 */
const MainMenu = () => {
    //Abrir modal de carga de documentos - Cargar producto
    ModalCargaDocumentos(
        "Cargar productos desde Excel", excelTemplate,
        { accept: ".xlsx,.xls,.csv" },
        async (data) => {
            //Envio de datos al Backend
            const fixedDataResult = fixedData(data);

            const response = await ExcelService.InsertarProductos(fixedDataResult).catch(err => {
                if(err && err.response && err.response.status === 401){
                    // Token inválido o expirado, manejar cierre de sesión
                    removeTokenStorage(localStorageKeys.tokenAuth);
                    Swal.fire({
                        icon: 'error',
                        title: 'Sesión expirada',
                        text: 'Por favor, inicia sesión nuevamente.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            });
            
            if (response && response.success) {
                await Swal.fire({ icon: 'success', title: 'Documento cargado con exito!', timer: 1500, showConfirmButton: false });
            }
            else {
                await Swal.fire({ icon: 'error', title: 'Error al cargar el documento', text: response.message || 'Inténtalo de nuevo.' });
            }

        },
        (err) => { console.error('Error en carga de documentos', err); }
        , null, ValidarProducto
    );
}

/**
 * Maneja el cierre de sesión
 */
const handleCerrarSesion = async () => {
    const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Se cerrará tu sesión actual',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
        removeTokenStorage(localStorageKeys.tokenAuth);
        await Swal.fire({
            icon: 'success',
            title: 'Sesión cerrada',
            text: 'Has cerrado sesión correctamente',
            timer: 1500,
            showConfirmButton: false
        });
    }
};

/**
 * Configuración de acciones de botones
 */
const configButtons = () => {
    // Configurar apertura del modal de autenticación si existe el botón
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            const isLogged = AuthService.isLogged();

            if (isLogged) {
                // Si el menú ya está abierto, cerrarlo
                if (isMenuOpen()) {
                    closeMenuConfiguracion();
                    return;
                }

                // Mostrar menú desplegable de configuración
                createMenuConfiguracion({
                    onCargarProductos: () => {
                        MainMenu();
                    },
                    onCerrarSesion: () => {
                        handleCerrarSesion();
                    }
                });
            } else {
                // Si no está logueado, abrir modal de autenticación
                ModalAutenticacion(
                    (response) => {
                        // Usuario autenticado con éxito
                        //Establecer el token de autenticación
                        const token = response.token;
                        setTokenAuth(token);

                        // Mostrar menú desplegable después de autenticarse
                        createMenuConfiguracion({
                            onCargarProductos: () => {
                                MainMenu();
                            },
                            onCerrarSesion: () => {
                                handleCerrarSesion();
                            }
                        });
                    },
                    () => { console.error('Usuario no autorizado'); },
                    (err) => { console.error('Error en autenticación', err); }
                );
            }
        });
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