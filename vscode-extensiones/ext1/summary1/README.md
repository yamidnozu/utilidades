# eDev Summary

## Descripción
eDev Summary es una extensión avanzada para Visual Studio Code que genera resúmenes concisos de archivos de código fuente en un único archivo RESUMEN.txt. Esta herramienta es esencial para proporcionar contexto rápido de tu proyecto a sistemas de IA, facilitar revisiones de código, y obtener una visión general del proyecto de manera eficiente.

## Características Principales
- 📁 Genera un archivo RESUMEN.txt con el contenido de los archivos seleccionados.
- 🔧 Soporta múltiples configuraciones personalizables para diferentes proyectos.
- 🎨 Interfaz de usuario intuitiva para configurar y ejecutar resúmenes.
- 🚫 Exclusión automática de directorios y archivos comúnmente ignorados.
- 📊 Soporte para múltiples extensiones de archivo.
- 🔍 Vista previa de la configuración antes de generar el resumen.
- 🔄 Actualización automática de extensiones de archivo basada en el contenido del directorio.
- 🗑️ Capacidad para eliminar configuraciones existentes.

## Instalación
1. Abre Visual Studio Code
2. Ve a la pestaña de Extensiones (Ctrl+Shift+X)
3. Busca "eDev Summary"
4. Haz clic en Instalar

## Uso Detallado

### Configuración Inicial
1. Abre la vista de eDev Summary en la barra de actividad lateral.
2. Haz clic en "Crear nueva configuración" en el menú desplegable.
3. Completa los campos del formulario:
   - Nombre de la configuración: Un identificador único para esta configuración.
   - Ruta del directorio base: La carpeta raíz de tu proyecto.
   - Directorios permitidos: (Opcional) Lista de subcarpetas específicas a incluir.
   - Directorios excluidos: Carpetas que no deseas incluir en el resumen.
   - Archivos excluidos: Archivos específicos que deseas omitir.
   - Extensiones de archivo: Se actualizarán automáticamente basándose en el contenido del directorio.
4. Haz clic en "Guardar" para almacenar tu configuración.

### Generación de Resumen
1. Selecciona la configuración deseada en el menú desplegable.
2. Haz clic en el botón "Generar".
3. eDev Summary creará un archivo RESUMEN.txt en el directorio base especificado.

## Ejemplos de Uso Detallados con Estructuras de Árbol

### Ejemplo 1: Proyecto React

Estructura del proyecto:
```
MiAppReact/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── About.jsx
│   ├── App.js
│   └── index.js
├── public/
│   └── index.html
├── node_modules/
├── package.json
└── README.md
```

Configuración de eDev Summary:
```json
{
  "name": "Proyecto React",
  "directoryPath": "C:\\Proyectos\\MiAppReact",
  "allowedDirectories": ["src", "public"],
  "excludedDirectories": ["node_modules"],
  "excludedFiles": ["package-lock.json"],
  "extensions": [".js", ".jsx", ".html", ".json"]
}
```

Resultado en RESUMEN.txt:
```
/* Inicio src/components/Header.jsx */
// Contenido de Header.jsx
/* Fin */

/* Inicio src/components/Footer.jsx */
// Contenido de Footer.jsx
/* Fin */

/* Inicio src/pages/Home.jsx */
// Contenido de Home.jsx
/* Fin */

/* Inicio src/pages/About.jsx */
// Contenido de About.jsx
/* Fin */

/* Inicio src/App.js */
// Contenido de App.js
/* Fin */

/* Inicio src/index.js */
// Contenido de index.js
/* Fin */

/* Inicio public/index.html */
// Contenido de index.html
/* Fin */

/* Inicio package.json */
// Contenido de package.json
/* Fin */

/* Inicio README.md */
// Contenido de README.md
/* Fin */
```

### Ejemplo 2: API Node.js con TypeScript

Estructura del proyecto:
```
MiApiNodeTS/
├── src/
│   ├── controllers/
│   │   ├── userController.ts
│   │   └── productController.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── Product.ts
│   ├── routes/
│   │   ├── userRoutes.ts
│   │   └── productRoutes.ts
│   ├── config/
│   │   └── database.ts
│   └── app.ts
├── tests/
│   ├── user.test.ts
│   └── product.test.ts
├── dist/
├── node_modules/
├── .env
├── tsconfig.json
└── package.json
```

Configuración de eDev Summary:
```json
{
  "name": "API Node.js TypeScript",
  "directoryPath": "/home/usuario/proyectos/MiApiNodeTS",
  "allowedDirectories": ["src", "config"],
  "excludedDirectories": ["node_modules", "dist", "tests"],
  "excludedFiles": [".env"],
  "extensions": [".ts", ".json"]
}
```

Resultado en RESUMEN.txt:
```
/* Inicio src/controllers/userController.ts */
// Contenido de userController.ts
/* Fin */

/* Inicio src/controllers/productController.ts */
// Contenido de productController.ts
/* Fin */

/* Inicio src/models/User.ts */
// Contenido de User.ts
/* Fin */

/* Inicio src/models/Product.ts */
// Contenido de Product.ts
/* Fin */

/* Inicio src/routes/userRoutes.ts */
// Contenido de userRoutes.ts
/* Fin */

/* Inicio src/routes/productRoutes.ts */
// Contenido de productRoutes.ts
/* Fin */

/* Inicio src/config/database.ts */
// Contenido de database.ts
/* Fin */

/* Inicio src/app.ts */
// Contenido de app.ts
/* Fin */

/* Inicio tsconfig.json */
// Contenido de tsconfig.json
/* Fin */

/* Inicio package.json */
// Contenido de package.json
/* Fin */
```

### Ejemplo 3: Proyecto Python de Ciencia de Datos

Estructura del proyecto:
```
ProyectoAnalisisPython/
├── scripts/
│   ├── data_preparation.py
│   ├── model_training.py
│   └── visualization.py
├── notebooks/
│   ├── exploratory_analysis.ipynb
│   └── model_evaluation.ipynb
├── data/
│   ├── raw/
│   │   └── dataset.csv
│   └── processed/
│       └── cleaned_data.csv
├── models/
│   └── trained_model.pkl
├── requirements.txt
└── README.md
```

Configuración de eDev Summary:
```json
{
  "name": "Análisis de Datos Python",
  "directoryPath": "D:\\DataScience\\ProyectoAnalisisPython",
  "allowedDirectories": ["scripts", "notebooks"],
  "excludedDirectories": ["data", "models"],
  "excludedFiles": ["*.csv", "*.pkl"],
  "extensions": [".py", ".ipynb", ".md"]
}
```

Resultado en RESUMEN.txt:
```
/* Inicio scripts/data_preparation.py */
// Contenido de data_preparation.py
/* Fin */

/* Inicio scripts/model_training.py */
// Contenido de model_training.py
/* Fin */

/* Inicio scripts/visualization.py */
// Contenido de visualization.py
/* Fin */

/* Inicio notebooks/exploratory_analysis.ipynb */
// Contenido de exploratory_analysis.ipynb
/* Fin */

/* Inicio notebooks/model_evaluation.ipynb */
// Contenido de model_evaluation.ipynb
/* Fin */

/* Inicio requirements.txt */
// Contenido de requirements.txt
/* Fin */

/* Inicio README.md */
// Contenido de README.md
/* Fin */
```

## Casos de Uso Avanzados con Ejemplos

### 1. Onboarding de Nuevos Desarrolladores

Estructura del proyecto:
```
MiProyecto/
├── docs/
│   ├── getting_started.md
│   └── architecture.md
├── config/
│   ├── development.json
│   └── production.json
├── templates/
│   ├── component_template.js
│   └── test_template.js
├── src/
│   └── ...
└── README.md
```

Configuración de eDev Summary:
```json
{
  "name": "Onboarding",
  "directoryPath": "C:\\Proyectos\\MiProyecto",
  "allowedDirectories": ["docs", "config", "templates"],
  "excludedDirectories": ["src"],
  "excludedFiles": [],
  "extensions": [".md", ".json", ".js"]
}
```

Esta configuración generará un RESUMEN.txt que incluirá toda la documentación relevante, archivos de configuración y plantillas, ideal para que los nuevos desarrolladores entiendan rápidamente la estructura y configuración del proyecto.

### 2. Revisión de Código para Pull Requests

Estructura del proyecto:
```
MiProyecto/
├── src/
│   ├── components/
│   │   └── NewFeature.js
│   ├── utils/
│   │   └── helperFunction.js
│   └── App.js
├── test/
│   └── NewFeature.test.js
└── ...
```

Configuración de eDev Summary:
```json
{
  "name": "PR Review",
  "directoryPath": "C:\\Proyectos\\MiProyecto",
  "allowedDirectories": ["src"],
  "excludedDirectories": ["node_modules", "dist"],
  "excludedFiles": ["*.test.js"],
  "extensions": [".js", ".jsx", ".ts", ".tsx"]
}
```

Esta configuración se centrará en los archivos de código fuente modificados, excluyendo pruebas y archivos generados, facilitando la revisión de los cambios específicos en un pull request.

### 3. Análisis de Seguridad

Estructura del proyecto:
```
MiProyecto/
├── src/
│   ├── auth/
│   │   └── authentication.js
│   └── config/
│       └── database.js
├── config/
│   ├── production.env
│   └── development.env
├── certificates/
│   └── server.key
└── ...
```

Configuración de eDev Summary:
```json
{
  "name": "Security Audit",
  "directoryPath": "C:\\Proyectos\\MiProyecto",
  "allowedDirectories": ["src/auth", "src/config", "config", "certificates"],
  "excludedDirectories": ["node_modules", "public"],
  "excludedFiles": [],
  "extensions": [".js", ".env", ".key"]
}
```

Esta configuración generará un resumen que incluye archivos relacionados con la autenticación, configuración y certificados, facilitando la auditoría de seguridad del proyecto.

## Consejos y Trucos

1. **Uso de Comodines**: En los campos de exclusión, utiliza patrones como `*.log` para excluir todos los archivos de registro.

2. **Configuraciones por Entorno**: Crea configuraciones separadas para desarrollo, pruebas y producción:
   ```json
   {
     "name": "Desarrollo",
     "directoryPath": "C:\\Proyectos\\MiProyecto",
     "allowedDirectories": ["src", "config"],
     "excludedDirectories": ["node_modules"],
     "excludedFiles": ["*.prod.js"],
     "extensions": [".js", ".ts", ".json"]
   }
   ```

3. **Resúmenes Incrementales**: Para proyectos grandes, divide tu resumen en partes:
   ```json
   {
     "name": "Frontend",
     "directoryPath": "C:\\Proyectos\\MiProyecto",
     "allowedDirectories": ["src/components", "src/pages"],
     "excludedDirectories": [],
     "excludedFiles": [],
     "extensions": [".js", ".jsx", ".css"]
   }
   ```
   ```json
   {
     "name": "Backend",
     "directoryPath": "C:\\Proyectos\\MiProyecto",
     "allowedDirectories": ["src/api", "src/models"],
     "excludedDirectories": [],
     "excludedFiles": [],
     "extensions": [".js", ".ts"]
   }
   ```

4. **Integración con Control de Versiones**: Incluye tu configuración de eDev Summary en el control de versiones:
   ```
   MiProyecto/
   ├── .vscode/
   │   └── edev-summary.json
   └── ...
   ```

5. **Actualización Regular**: Revisa y actualiza tus configuraciones después de cambios significativos en la estructura del proyecto:
   ```json
   {
     "name": "Proyecto v2",
     "directoryPath": "C:\\Proyectos\\MiProyecto",
     "allowedDirectories": ["src", "new-feature"],
     "excludedDirectories": ["deprecated"],
     "excludedFiles": [],
     "extensions": [".ts", ".tsx", ".css"]
   }
   ```

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
R: Sí, puedes usar patrones glob como `*.log` o `test_*.py`