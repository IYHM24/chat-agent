import AuthService from '../services/AuthService.js';

/**
 * Menú desplegable de configuración
 * Se muestra cuando el usuario hace clic en el botón de configuración (⚙️)
 * Solo se muestra si el usuario está autenticado
 */

let menuElement = null;

/**
 * Crea el menú desplegable de configuración
 * @param {Object} options - Opciones del menú
 * @param {Function} options.onCargarProductos - Callback cuando se selecciona "Cargar Productos"
 * @param {Function} options.onCerrarSesion - Callback cuando se selecciona "Cerrar Sesión"
 * @param {Function} options.onCargarDatasheets - Callback cuando se selecciona "Cargar Datasheets"
 */
export const createMenuConfiguracion = (options = {}) => {
    
    // Si ya existe el menú, removerlo
    if (menuElement) {
        menuElement.remove();
        menuElement = null;
    }

    // Crear el elemento del menú
    menuElement = document.createElement('div');
    menuElement.id = 'menu-configuracion';
    menuElement.className = 'absolute bottom-24 right-6 bg-black border border-red-600 rounded-lg shadow-xl overflow-hidden z-50 opacity-0 scale-95 transition-all duration-200';
    menuElement.style.minWidth = '250px';

    menuElement.innerHTML = `
        <div class="py-2">
            <div class="px-4 py-3 border-b border-gray-700">
                <p class="text-sm text-gray-400">Configuración</p>
            </div>
            
            <button id="menu-cargar-productos" class="w-full text-left px-4 py-3 text-white hover:bg-gray-900 transition-colors flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span>Cargar Productos</span>
            </button>

            <button id="menu-cargar-datasheets" class="w-full text-left px-4 py-3 text-white hover:bg-gray-900 transition-colors flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span>Cargar Datasheets</span>
            </button>

            <button id="menu-cerrar-sesion" class="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-900 transition-colors flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Cerrar Sesión</span>
            </button>
        </div>
    `;

    // Agregar al body
    document.body.appendChild(menuElement);

    // Animar entrada
    setTimeout(() => {
        menuElement.classList.remove('opacity-0', 'scale-95');
        menuElement.classList.add('opacity-100', 'scale-100');
    }, 10);

    // Event listeners para las opciones del menú
    const btnCargarProductos = menuElement.querySelector('#menu-cargar-productos');
    const btnCerrarSesion = menuElement.querySelector('#menu-cerrar-sesion');
    const btnCargarDatasheets = menuElement.querySelector('#menu-cargar-datasheets');

    btnCargarProductos.addEventListener('click', () => {
        closeMenuConfiguracion();
        if (options.onCargarProductos) {
            options.onCargarProductos();
        }
    });

    btnCerrarSesion.addEventListener('click', () => {
        closeMenuConfiguracion();
        if (options.onCerrarSesion) {
            options.onCerrarSesion();
        }
    });

    btnCargarDatasheets.addEventListener('click', () => {
        closeMenuConfiguracion();
        if (options.onCargarDatasheets) {
            options.onCargarDatasheets();
        }
    });

    // Cerrar menú al hacer clic fuera
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 0);

    return menuElement;
};

/**
 * Maneja clics fuera del menú para cerrarlo
 */
const handleClickOutside = (e) => {
    if (menuElement && !menuElement.contains(e.target) && !e.target.closest('#settings-btn')) {
        closeMenuConfiguracion();
    }
};

/**
 * Cierra y remueve el menú de configuración
 */
export const closeMenuConfiguracion = () => {
    if (menuElement) {
        // Animar salida
        menuElement.classList.remove('opacity-100', 'scale-100');
        menuElement.classList.add('opacity-0', 'scale-95');
        
        setTimeout(() => {
            document.removeEventListener('click', handleClickOutside);
            menuElement.remove();
            menuElement = null;
        }, 200);
    }
};

/**
 * Verifica si el menú está abierto
 */
export const isMenuOpen = () => {
    return menuElement !== null;
};
