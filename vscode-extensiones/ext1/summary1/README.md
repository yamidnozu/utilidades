# eDev Summary: Extensión de Resumen de Proyecto para VSCode

## Propósito
eDev Summary es una extensión para Visual Studio Code diseñada para crear un archivo consolidado llamado `RESUMEN.txt`. Este archivo contiene un resumen del contenido de múltiples archivos de un proyecto, permitiendo a los desarrolladores obtener una visión general rápida y clara de su código fuente. Cada archivo incluido en el resumen está claramente delimitado por separadores, facilitando la navegación y comprensión del contenido.

## Características Principales

### 1. Configuración de la Ruta del Proyecto
- Los usuarios pueden especificar la ruta principal del proyecto que desean resumir.
- Ejemplo: 
  ```
  Ruta del Proyecto: C:/proyectos/mi-aplicacion-web
  ```

### 2. Selección de Carpetas a Resumir
- Permite a los usuarios seleccionar carpetas específicas (y sus subcarpetas) para incluir en el resumen.
- Si no se especifican carpetas, el análisis comienza desde la ruta principal configurada.
- Ejemplo:
  ```
  Ruta principal: C:/proyectos/mi-aplicacion-web
  Carpetas seleccionadas:
  - C:/proyectos/mi-aplicacion-web/src/components
  - C:/proyectos/mi-aplicacion-web/src/pages
  ```

### 3. Exclusión de Directorios
- Los usuarios pueden configurar directorios específicos para ser excluidos del resumen.
- Estas exclusiones se aplican dentro de las carpetas seleccionadas o en toda la ruta principal si no se especificaron carpetas.
- Se ignoran en todos los niveles de profundidad dentro del ámbito de análisis.
- Ejemplo:
  ```
  Directorios excluidos:
  - node_modules
  - build
  - dist
  - src/components/deprecated
  ```

### 4. Exclusión de Archivos
- Permite especificar archivos individuales o patrones de archivos para excluir del resumen.
- Ejemplo:
  ```
  Archivos excluidos:
  - config.js
  - *.test.js
  - .env
  ```

### 5. Gestión de Configuraciones
- Los usuarios pueden crear, guardar y eliminar configuraciones personalizadas.
- Cada configuración incluye:
  - Ruta del proyecto
  - Carpetas seleccionadas para resumir
  - Directorios excluidos
  - Archivos excluidos
- Esto permite cambiar rápidamente entre diferentes configuraciones para distintos proyectos o escenarios de análisis.
- Ejemplo:
  ```json
  {
    "name": "Proyecto Web Frontend",
    "directoryPath": "C:/proyectos/mi-aplicacion-web",
    "allowedDirectories": ["src/components", "src/pages"],
    "excludedDirectories": ["node_modules", "build"],
    "excludedFiles": ["*.test.js", "config.js"],
    "extensions": [".js", ".jsx", ".css"],
    "showAllExtensions": false
  }
  ```

### 6. Análisis y Selección de Extensiones de Archivo
- La extensión analiza y muestra las extensiones de archivo presentes en el ámbito de análisis definido.
- Muestra las extensiones encontradas como badges visuales.
- Permite a los usuarios seleccionar qué extensiones de archivo incluir en el resumen final.
- El análisis respeta todas las configuraciones de inclusión y exclusión establecidas.
- Ejemplo:
  ```
  Extensiones encontradas: 🏷️ .js  🏷️ .jsx  🏷️ .css  🏷️ .html  🏷️ .json
  Extensiones seleccionadas: ✅ .js  ✅ .jsx  ✅ .css
  ```

### 7. Toggle para Mostrar Todas las Combinaciones de Extensiones
- Un nuevo toggle permite a los usuarios elegir entre mostrar solo las extensiones principales o todas las combinaciones de extensiones.
- Cuando está activado, muestra extensiones compuestas como `.d.ts` o `.test.js`.
- Útil para proyectos con nomenclaturas de archivo complejas o múltiples extensiones.
- Ejemplo con el toggle activado:
  ```
  Extensiones encontradas: 🏷️ .js  🏷️ .jsx  🏷️ .css  🏷️ .html  🏷️ .json  🏷️ .d.ts  🏷️ .test.js
  ```

## Proceso de Análisis y Resumen

1. **Determinación del Ámbito de Análisis**:
   - Si se especifican carpetas permitidas: analiza solo estas carpetas y sus subcarpetas.
   - Si no se especifican carpetas: analiza desde la ruta principal del proyecto.

2. **Aplicación de Exclusiones**:
   - Aplica las exclusiones de directorios y archivos configuradas.
   - Las exclusiones se respetan en todos los niveles de profundidad dentro del ámbito de análisis.

3. **Análisis Inicial de Extensiones**:
   - Escanea todos los archivos dentro del ámbito definido.
   - Identifica y muestra todas las extensiones de archivo encontradas.
   - Si el toggle "Mostrar todas las combinaciones de extensiones" está activado, incluye extensiones compuestas.

4. **Selección de Extensiones por el Usuario**:
   - Presenta las extensiones encontradas al usuario.
   - El usuario selecciona qué extensiones desea incluir en el resumen.

5. **Generación del Resumen**:
   - Crea el archivo `RESUMEN.txt`.
   - Incluye solo los archivos con las extensiones seleccionadas por el usuario.
   - Respeta todas las configuraciones de inclusión y exclusión.
   - Cada archivo en el resumen está delimitado por separadores claros.

## Escenarios de Uso

### Escenario 1: Análisis Completo del Proyecto

**Configuración:**
- Ruta del proyecto: `C:/proyectos/mi-aplicacion-web`
- Carpetas permitidas: [vacío]
- Directorios excluidos: [vacío]
- Archivos excluidos: [vacío]
- Mostrar todas las combinaciones de extensiones: No

**Comportamiento:**
- Analiza todos los archivos y carpetas desde la ruta principal.
- Incluye todas las subcarpetas en el análisis.

**Ejemplo de Estructura:**
```
C:/proyectos/mi-aplicacion-web
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📄 Header.js
│   │   └── 📄 Footer.js
│   ├── 📁 pages/
│   │   ├── 📄 Home.js
│   │   └── 📄 About.js
│   └── 📁 utils/
│       └── 📄 helpers.js
├── 📁 public/
│   └── 📄 index.html
└── 📄 package.json

Extensiones encontradas: 🏷️ .js  🏷️ .html  🏷️ .json

Resultado (si se seleccionan todas las extensiones):
- Incluirá todos los archivos .js, .html, y .json en RESUMEN.txt
```

### Escenario 2: Análisis Selectivo con Exclusiones

**Configuración:**
- Ruta del proyecto: `C:/proyectos/mi-aplicacion-web`
- Carpetas permitidas: `src/components`, `src/pages`
- Directorios excluidos: `src/components/deprecated`
- Archivos excluidos: `*.test.js`
- Mostrar todas las combinaciones de extensiones: Sí

**Comportamiento:**
- Analiza solo las carpetas `components` y `pages` dentro de `src`.
- Excluye la carpeta `deprecated` dentro de `components`.
- No incluye archivos de prueba (*.test.js).
- Muestra extensiones compuestas como `.test.js` (aunque estén excluidas).

**Ejemplo de Estructura:**
```
C:/proyectos/mi-aplicacion-web
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 deprecated/        (excluido)
│   │   │   └── 📄 OldComponent.js
│   │   ├── 📄 Header.js
│   │   ├── 📄 Footer.js
│   │   └── 📄 Header.test.js     (excluido)
│   ├── 📁 pages/
│   │   ├── 📄 Home.js
│   │   └── 📄 About.js
│   └── 📁 utils/                 (no analizado)
│       └── 📄 helpers.js
└── 📁 public/                    (no analizado)
    └── 📄 index.html

Extensiones encontradas: 🏷️ .js  🏷️ .test.js

Resultado (si se selecciona .js):
- Incluirá Header.js, Footer.js, Home.js, y About.js en RESUMEN.txt
```

### Escenario 3: Análisis con Extensiones Específicas

**Configuración:**
- Ruta del proyecto: `C:/proyectos/mi-aplicacion-web`
- Carpetas permitidas: `src`
- Directorios excluidos: [vacío]
- Archivos excluidos: [vacío]
- Mostrar todas las combinaciones de extensiones: Sí

**Comportamiento:**
- Analiza toda la carpeta `src` y sus subcarpetas.
- El usuario selecciona solo ciertas extensiones para incluir.
- Muestra todas las combinaciones de extensiones encontradas.

**Ejemplo de Estructura:**
```
C:/proyectos/mi-aplicacion-web
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📄 Header.tsx
│   │   └── 📄 Footer.tsx
│   ├── 📁 pages/
│   │   ├── 📄 Home.js
│   │   └── 📄 About.js
│   ├── 📁 styles/
│   │   └── 📄 main.css
│   └── 📁 utils/
│       ├── 📄 helpers.ts
│       └── 📄 types.d.ts
└── 📁 public/                    (no analizado)
    └── 📄 index.html

Extensiones encontradas: 🏷️ .tsx  🏷️ .js  🏷️ .css  🏷️ .ts  🏷️ .d.ts

Extensiones seleccionadas por el usuario: ✅ .js  ✅ .ts

Resultado:
- Incluirá Home.js, About.js, y helpers.ts en RESUMEN.txt
- No incluirá archivos .tsx, .css, o .d.ts
```

### Escenario 4: Análisis de Proyecto con Múltiples Tecnologías

**Configuración:**
- Ruta del proyecto: `C:/proyectos/app-fullstack`
- Carpetas permitidas: `frontend/src`, `backend/src`
- Directorios excluidos: `frontend/src/assets`, `backend/src/tests`
- Archivos excluidos: `*.config.js`
- Mostrar todas las combinaciones de extensiones: Sí

**Comportamiento:**
- Analiza las carpetas `src` tanto del frontend como del backend.
- Excluye carpetas de assets y tests.
- No incluye archivos de configuración.
- Muestra todas las combinaciones de extensiones, incluyendo `.config.js` (aunque estén excluidos).

**Ejemplo de Estructura:**
```
C:/proyectos/app-fullstack
├── 📁 frontend/
│   └── 📁 src/
│       ├── 📁 components/
│       │   ├── 📄 App.js
│       │   └── 📄 Navbar.js
│       ├── 📁 pages/
│       │   └── 📄 Home.js
│       └── 📁 assets/            (excluido)
│           └── 📄 logo.svg
├── 📁 backend/
│   └── 📁 src/
│       ├── 📁 routes/
│       │   └── 📄 api.js
│       ├── 📁 models/
│       │   └── 📄 User.js
│       ├── 📁 tests/             (excluido)
│       │   └── 📄 api.test.js
│       └── 📄 server.js
├── 📄 frontend.config.js         (excluido)
└── 📄 backend.config.js          (excluido)

Extensiones encontradas: 🏷️ .js  🏷️ .svg  🏷️ .test.js  🏷️ .config.js

Extensiones seleccionadas por el usuario: ✅ .js

Resultado:
- Incluirá App.js, Navbar.js, Home.js, api.js, User.js, y server.js en RESUMEN.txt
- No incluirá archivos de las carpetas assets o tests, ni los archivos de configuración
```

## Funcionalidades Adicionales

1. **Interfaz Gráfica de Usuario (GUI)**
   - La extensión proporciona una interfaz web integrada en VSCode para la configuración y gestión.
   - Ejemplo: Panel lateral con campos para ingresar la ruta del proyecto, seleccionar carpetas, y configurar exclusiones.

2. **Carga Dinámica de Extensiones**
   - La extensión analiza dinámicamente el proyecto para encontrar todas las extensiones de archivo presentes.
   - Ejemplo: Al seleccionar una carpeta, automáticamente muestra badges con extensiones como 🏷️ .js, 🏷️ .css, 🏷️ .html, etc.

3. **Valores por Defecto para Exclusiones**
   - Proporciona listas predefinidas de directorios y archivos comúnmente excluidos.
   - Ejemplo:
     ```
     Directorios excluidos por defecto: node_modules, .git, dist, build
     Archivos excluidos por defecto: .env, *.log, .DS_Store
     ```

4. **Persistencia de Configuraciones**
   - Utiliza la API de configuración de VSCode para guardar y cargar configuraciones entre sesiones.
   - Ejemplo: El usuario puede guardar múltiples configuraciones con nombres como "Proyecto Frontend", "Proyecto Backend", etc., y cargarlas fácilmente.

5. **Feedback Visual durante el Proceso**
   - Incluye un loader y mensajes de estado para informar al usuario sobre el progreso de las operaciones.
   - Ejemplo: Muestra un spinner y el mensaje "Analizando archivos..." mientras escanea el proyecto.

6. **Validación de Entrada**
   - Realiza validaciones básicas de los campos de entrada para prevenir errores.
   - Ejemplo: Verifica que se haya seleccionado una configuración antes de ejecutar el resumen y muestra un mensaje de error si no es así.

7. **Toggle para Mostrar Todas las Combinaciones de Extensiones**
   - Permite a los usuarios ver y seleccionar extensiones de archivo más específicas.
   - Útil para proyectos con nomenclaturas de archivo complejas o múltiples extensiones.
   - Ejemplo: Muestra `.test.js` y `.config.js` además de `.js` cuando está activado.

## Instalación
1. Abre Visual Studio Code
2. Ve a la pestaña de Extensiones (Ctrl+Shift+X)
3. Busca "eDev Summary"
4. Haz clic en Instalar

## Uso Detallado

1. Abre la vista de eDev Summary en la barra de actividad lateral de VSCode.
2. Crea una nueva configuración o selecciona una existente.
3. Configura los parámetros según tus necesidades:
   - Ruta del proyecto
   - Carpetas permitidas
   - Directorios y archivos excluidos
   - Activa o desactiva el toggle "Mostrar todas las combinaciones de extensiones"
4. La extensión analizará automáticamente las extensiones presentes en el proyecto.
5. Selecciona las extensiones de archivo que deseas incluir en el resumen.
6. Haz clic en "Generar Resumen" para crear el archivo RESUMEN.txt.

## Consejos y Trucos

1. **Uso de Comodines**: En los campos de exclusión, utiliza patrones como `*.log` para excluir todos los archivos de registro.

2. **Configuraciones por Entorno**: Crea configuraciones separadas para desarrollo, pruebas y producción:
   ```json
   {
     "name": "Desarrollo",
     "directoryPath": "C:/proyectos/mi-aplicacion-web",
     "allowedDirectories": ["src", "config"],
     "excludedDirectories": ["node_modules"],
     "excludedFiles": ["*.prod.js"],
     "extensions": [".js", ".ts", ".json"],
     "showAllExtensions": false
   }
   ```

3. **Resúmenes Incrementales**: Para proyectos grandes, divide tu resumen en partes:
   ```json
   {
     "name": "Frontend",
     "directoryPath": "C:/proyectos/mi-aplicacion-web",
     "allowedDirectories": ["src/components", "src/pages"],
     "excludedDirectories": [],
     "excludedFiles": [],
     "extensions": [".js", ".jsx", ".css"],
     "showAllExtensions": true
   }
   ```

4. **Integración con Control de Versiones**: Considera incluir tu configuración de eDev Summary en el control de versiones para compartirla con tu equipo.

5. **Actualización Regular**: Revisa y actualiza tus configuraciones después de cambios significativos en la estructura del proyecto.

6. **Uso del Toggle de Extensiones**: Activa el toggle "Mostrar todas las combinaciones de extensiones" cuando trabajes en proyectos con nomenclaturas de archivo complejas o si necesitas un control más granular sobre las extensiones incluidas en el resumen.

## Preguntas Frecuentes

**P: ¿Puedo usar eDev Summary con cualquier lenguaje de programación?**
R: Sí, eDev Summary es agnóstico al lenguaje. Puedes configurarlo para trabajar con cualquier tipo de archivo de texto.

**P: ¿El resumen generado incluye el contenido completo de los archivos?**
R: Sí, el archivo RESUMEN.txt incluye el contenido completo de los archivos seleccionados según tu configuración.

**P: ¿Cuántas configuraciones diferentes puedo tener?**
R: No hay límite en el número de configuraciones que puedes crear y guardar.

**P: ¿Cómo maneja eDev Summary los archivos grandes?**
R: eDev Summary está optimizado para manejar archivos de tamaño razonable. Para archivos extremadamente grandes, considera excluirlos o crear una configuración separada.

**P: ¿Puedo usar expresiones regulares en los nombres de archivos excluidos?**
R: Sí, puedes usar patrones glob como `*.log` o `test_*.py` en los campos de exclusión.

**P: ¿Qué hace el toggle "Mostrar todas las combinaciones de extensiones"?**
R: Este toggle permite mostrar todas las posibles combinaciones de extensiones de archivo en tu proyecto. Por ejemplo, en lugar de mostrar solo `.js`, también mostrará extensiones como `.test.js` o `.config.js`. Esto es útil para proyectos con estructuras de archivo más complejas o cuando necesitas un control más preciso sobre qué tipos de archivo incluir en tu resumen.

## Limitaciones Conocidas

- La extensión está optimizada para proyectos de tamaño medio. Para proyectos muy grandes, considera crear múltiples configuraciones para diferentes partes del proyecto.
- El resumen incluye el contenido completo de los archivos seleccionados. Para archivos muy grandes, esto podría resultar en un RESUMEN.txt extenso.
- Cuando se activa "Mostrar todas las combinaciones de extensiones", el análisis puede tardar más tiempo en proyectos con muchos archivos y extensiones variadas.

## Soporte y Contribuciones

Si encuentras algún problema o tienes sugerencias para mejorar eDev Summary, por favor abre un issue en nuestro repositorio de GitHub. Las contribuciones son bienvenidas y apreciadas.

## Licencia

eDev Summary se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` en el repositorio para más detalles.

---

Gracias por usar eDev Summary. Esperamos que esta herramienta mejore tu flujo de trabajo y facilite la comprensión de tus proyectos.