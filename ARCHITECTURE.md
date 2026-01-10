# 📐 Arquitectura del Proyecto - Asistente Fortinet

## 📋 Descripción General
Aplicación web de chatbot interactivo para asesoría de productos Fortinet con funcionalidades de autenticación y gestión de documentos Excel.

---

## 🏗️ Estructura del Proyecto

```
frontedn/
├── index.html                      # Punto de entrada HTML
├── main.js                         # Punto de entrada JavaScript (módulo ES6)
├── jsconfig.json                   # Configuración de JavaScript
├── tailwind.config.js              # Configuración de Tailwind CSS
├── soluciones.json                 # Datos de soluciones/productos
├── README.md                       # Documentación del proyecto
├── ARCHITECTURE.md                 # Este archivo
│
├── Docs/                           # Archivos Excel de referencia
│   └── (archivos .xlsx)
│
└── src/                            # Código fuente
    ├── main.js                     # Lógica principal alternativa
    │
    ├── config/                     # Configuración global
    │   └── variables.js            # Variables globales (API URLs, etc.)
    │
    ├── components/                 # Componentes de UI
    │   └── ComponentesFormulario.js # Chat form y controles
    │
    ├── modal/                      # Modales (SweetAlert2)
    │   ├── ModalAutenticacion.js   # Login modal
    │   └── ModalCargaDocumentos.js # Drag & drop Excel uploader
    │
    ├── services/                   # Servicios (API calls)
    │   ├── ChatService.js          # Servicio de chat (vacío)
    │   └── ExcelService.js         # Servicio de Excel (vacío)
    │
    ├── utils/                      # Utilidades
    │   └── (helpers, parsers, etc.)
    │
    ├── img/                        # Recursos gráficos
    │   ├── fortinet.png
    │   └── wexler.png
    │
    ├── style/                      # Estilos CSS
    │   └── style.css
    │
    ├── page/                       # Páginas adicionales
    ├── php/                        # Scripts PHP (legacy)
    │   ├── import_excel.php
    │   └── process_excel.php
    └── other/
        └── script.js
```

---

## 🎯 Arquitectura de la Aplicación

### **Patrón de Diseño: Modular con ES6 Modules**

```
┌─────────────────────────────────────────────┐
│           index.html                        │
│  (UI + Tailwind + SweetAlert2 + SheetJS)    │
└─────────────────┬───────────────────────────┘
                  │
                  ├─> main.js (Entry Point)
                  │
    ┌─────────────┴─────────────┐
    │   ConfiguracionInicial()  │
    └─────────────┬─────────────┘
                  │
    ┌─────────────┼─────────────────────────┐
    │             │                         │
    v             v                         v
┌─────────┐  ┌──────────┐        ┌──────────────────┐
│ Config  │  │Components│        │     Modales      │
│         │  │          │        │                  │
│variables│  │Formulario│        │ModalAutenticacion│
│   .js   │  │  Chat    │        │ModalCargaDocumentos│
└─────────┘  └──────────┘        └──────────────────┘
                  │                         │
                  v                         v
             ┌─────────┐            ┌──────────────┐
             │ ChatBox │            │   Services   │
             │  (UI)   │            │ (API Calls)  │
             └─────────┘            └──────────────┘
```

---

## 🔧 Componentes Principales

### **1. Entry Point (`main.js`)**

**Responsabilidades:**
- Inicializar configuración global
- Registrar event listeners
- Orquestar la apertura de modales

**Flujo:**
```javascript
DOMContentLoaded
    → ConfiguracionInicial()
        → initVariales()              // Configurar variables globales
        → settingsBtn.addEventListener() // Vincular botón de configuración
```

---

### **2. Configuración (`src/config/variables.js`)**

**Propósito:** Centralizar variables globales del proyecto.

**API:**
```javascript
export const initVariales = () => {
  window.apiUrl = "http://localhost:8000/api/chatbot";
}

export const getGlobalVariable = (key) => window[key];
export const setGlobalVariable = (key, value) => { window[key] = value; }
```

**Variables disponibles:**
- `window.apiUrl` - URL del backend de chat
- `window.fortinetProducts` - Datos cargados desde Excel (cuando se usa ModalCargaDocumentos)

---

### **3. Componentes de UI (`src/components/ComponentesFormulario.js`)**

**Elementos exportados:**
- `form` - Formulario del chat
- `chatbox` - Contenedor de mensajes
- `input` - Campo de texto del usuario
- `settingsBtn` - Botón flotante de configuración (engranaje)

**Funcionalidades:**
- Submit con Enter (sin Shift)
- Renderizado de mensajes usuario/bot
- Scroll automático

---

### **4. Modales**

#### **4.1. ModalAutenticacion (`src/modal/ModalAutenticacion.js`)**

**Firma:**
```javascript
ModalAutenticacion(funExito, funUnAut, funError)
```

**Parámetros:**
- `funExito()` - Callback si autenticación exitosa
- `funUnAut()` - Callback si credenciales incorrectas
- `funError(err)` - Callback si ocurre error

**Autenticación simulada:**
- Usuario: `admin`
- Contraseña: `admin`

**Stack tecnológico:**
- SweetAlert2 para UI
- Validación inline
- Autenticación asíncrona (simulada con timeout)

---

#### **4.2. ModalCargaDocumentos (`src/modal/ModalCargaDocumentos.js`)**

**Firma:**
```javascript
ModalCargaDocumentos(funExito, funError, sheetName) => Promise<Array>
```

**Parámetros:**
- `funExito(data)` - Callback con array de objetos si carga exitosa
- `funError(err)` - Callback si ocurre error o se cancela
- `sheetName` (opcional) - Nombre de la hoja Excel a leer

**Características:**
- Drag & drop de archivos Excel (.xlsx, .xls, .csv)
- Validación de tipo de archivo
- Parsing con SheetJS (XLSX.js)
- Retorna Promise + ejecuta callbacks
- Si se especifica `sheetName`, solo lee esa hoja (error si no existe)

**Flujo:**
```
Usuario arrastra archivo
    → Validar extensión
    → FileReader.readAsArrayBuffer()
    → XLSX.read()
    → sheet_to_json()
    → funExito(data) o funError(err)
```

**Uso típico:**
```javascript
ModalCargaDocumentos(
  (data) => {
    console.log('Excel cargado:', data);
    window.fortinetProducts = data;
  },
  (err) => console.error(err),
  'FortiGate'  // Leer solo la hoja "FortiGate"
);
```

---

## 📦 Dependencias Externas

### **CDN (incluidas en `index.html`):**

```html
<!-- Estilos y Frameworks CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Librerías JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>

<!-- Aplicación Principal -->
<script src="./main.js" type="module"></script>
```

| Librería | Versión | Propósito |
|----------|---------|-----------|
| **Tailwind CSS** | Latest (CDN) | Estilos utility-first |
| **SweetAlert2** | v11 | Modales elegantes y personalizables |
| **SheetJS (xlsx)** | Latest | Lectura/escritura de archivos Excel |

---

## 🔄 Flujo de Datos

### **Flujo de Carga de Documentos:**

```
[Usuario]
    │
    ├─> Click en botón engranaje (settings-btn)
    │
    └─> ModalCargaDocumentos()
            │
            ├─> SweetAlert2 muestra modal drag-and-drop
            │
            ├─> Usuario arrastra archivo Excel
            │
            ├─> FileReader lee archivo
            │
            ├─> XLSX.read() parsea el workbook
            │
            ├─> Selecciona hoja (sheetName o primera)
            │
            ├─> XLSX.utils.sheet_to_json() convierte a JSON
            │
            └─> funExito(data) ejecuta callback
                    │
                    └─> window.fortinetProducts = data
```

### **Flujo de Autenticación:**

```
[Usuario]
    │
    └─> ModalAutenticacion()
            │
            ├─> SweetAlert2 muestra login form
            │
            ├─> Usuario ingresa credenciales
            │
            ├─> authenticate() simula validación
            │
            └─> if (success) → funExito()
                else → funUnAut()
```

---

## 🎨 Stack Tecnológico

### **Frontend:**
- **HTML5** - Estructura semántica
- **CSS3** + **Tailwind CSS** - Estilos modernos y responsivos
- **JavaScript ES6+** - Módulos, Promises, async/await
- **SweetAlert2** - Modales interactivos
- **SheetJS** - Manipulación de Excel en el navegador

### **Backend (previsto):**
- API REST en `http://localhost:8000/api/chatbot`
- Servicios PHP en `src/php/` (legacy, no activos)

---

## 🔐 Seguridad

### **Consideraciones actuales:**

⚠️ **Autenticación simulada:**
- Las credenciales `admin/admin` están hardcodeadas
- **Recomendación:** Implementar autenticación real con JWT o OAuth

⚠️ **CORS:**
- Las llamadas a API externas pueden requerir configuración CORS en el backend

⚠️ **Validación de archivos:**
- Solo se valida extensión, no el contenido real del archivo
- **Recomendación:** Validar MIME type y tamaño máximo

---

## 🧩 Extensibilidad

### **Agregar nuevos modales:**

```javascript
// src/modal/MiNuevoModal.js
export const MiNuevoModal = (callback) => {
  Swal.fire({
    title: 'Mi Modal',
    html: '...',
    // ...
  }).then((result) => {
    if (result.isConfirmed) callback(result.value);
  });
};
```

### **Agregar nuevos servicios:**

```javascript
// src/services/MiServicio.js
export async function fetchData(endpoint) {
  const apiUrl = window.apiUrl;
  const response = await fetch(`${apiUrl}/${endpoint}`);
  return response.json();
}
```

---

## 📊 Datos y Modelos

### **Formato de productos Fortinet (esperado del Excel):**

```javascript
{
  unit: "FortiGate-30G",
  sku: "FG-30G",
  description: "4 x GE RJ45 ports...",
  price: 395,
  contract1Yr: 731,
  contract2Yr: 1302,
  contract3Yr: 1822,
  contract4Yr: null,
  contract5Yr: null,
  category: "FortiGate Entry-Level"
}
```

---

## 🚀 Despliegue

### **Desarrollo local:**
```bash
# Usar cualquier servidor HTTP estático, por ejemplo:
npx five-server
# o
python -m http.server 8080
```

### **Producción:**
- Servir archivos estáticos desde CDN o servidor web
- Configurar variable `window.apiUrl` según entorno
- Minificar JavaScript y CSS

---

## 📝 Convenciones de Código

### **Nombres de archivos:**
- PascalCase para componentes: `ModalAutenticacion.js`
- camelCase para utilidades: `variables.js`

### **Exports:**
- Named exports para funciones: `export const initVariales`
- Default exports para componentes principales (opcional)

### **Callbacks:**
- Prefijo `fun` para parámetros de callback: `funExito`, `funError`

---

## 🐛 Debugging

### **Variables globales útiles:**
```javascript
// En la consola del navegador
window.apiUrl                 // Ver URL de API configurada
window.fortinetProducts       // Ver productos cargados desde Excel
```

### **Logs activados:**
- Consola muestra resultados de `ModalCargaDocumentos` y `ModalAutenticacion`

---

## 🔮 Roadmap / TODOs

- [ ] Implementar ChatService con backend real
- [ ] Reemplazar autenticación simulada por JWT
- [ ] Agregar filtros y búsqueda de productos en UI
- [ ] Crear parseFortinetPriceList.js para limpiar datos del Excel
- [ ] Implementar cache de productos en localStorage
- [ ] Agregar tests unitarios (Jest/Vitest)
- [ ] Agregar CI/CD pipeline

---

## 📚 Referencias

- [SweetAlert2 Documentation](https://sweetalert2.github.io/)
- [SheetJS Documentation](https://docs.sheetjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

**Última actualización:** 8 de enero de 2026  
**Versión:** 1.0.0  
**Mantenedor:** Equipo Nycolt
