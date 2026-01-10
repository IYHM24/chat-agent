import { initVariales } from "./src/config/variables.js";
import { initSweetAlert } from "./src/config/sweetalert.js";
import { settingsBtn } from "./src/components/ComponentesFormulario.js";
import { ModalAutenticacion } from "./src/modal/ModalAutenticacion.js";
import { ModalCargaDocumentos } from "./src/modal/ModalCargaDocumentos.js";
import { fixedData } from "./src/utils/fixedData.js";
import { setTokenAuth } from "./src/config/fetch.js";
import { ValidarProducto } from "./src/utils/excelValidator.js";
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
        async (data) => {
            //Envio de datos al Backend
            const fixedDataResult = fixedData(data);
            const response = await ExcelService.InsertarProductos(fixedDataResult)
            if (response && response.success) {
                await Swal.fire({ icon: 'success', title: 'Documento cargado con exito!', timer: 1500, showConfirmButton: false });
            }
        },
        (err) => { console.error('Error en carga de documentos', err); }
        , null, ValidarProducto
    );
}

/**
 * Configuración de acciones de botones
 */
const configButtons = () => {
    // Configurar apertura del modal de autenticación si existe el botón
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            const isLogged = AuthService.isLogged();
            if (isLogged) {
                MainMenu();
                return;
            } else {
                ModalAutenticacion(
                    (response) => {
                        // Usuario autenticado con éxito
                        //Establecer el token de autenticación
                        const token = response.token;
                        setTokenAuth(token);
                        MainMenu();
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