# eDev Summary

## Descripción
eDev Summary es una potente extensión para Visual Studio Code que genera resúmenes de archivos de código fuente en un solo archivo RESUMEN.txt. Esta herramienta es especialmente útil para proporcionar contexto rápido de tu proyecto a sistemas de IA o para revisiones de código.

## Características
- 📁 Genera un archivo RESUMEN.txt con el contenido de los archivos seleccionados.
- 🔧 Soporta múltiples configuraciones personalizables para diferentes proyectos.
- 🎨 Interfaz de usuario intuitiva para configurar y ejecutar resúmenes.
- 🚫 Exclusión automática de directorios y archivos comúnmente ignorados.
- 📊 Soporte para múltiples extensiones de archivo.
- 🔍 Vista previa de la configuración antes de generar el resumen.

## Instalación
1. Abre Visual Studio Code
2. Ve a la pestaña de Extensiones (Ctrl+Shift+X)
3. Busca "eDev Summary"
4. Haz clic en Instalar

## Uso
### Configuración Inicial
1. Abre la vista de eDev Summary en la barra de actividad lateral.
2. Haz clic en "Crear nueva configuración" o selecciona una existente.
3. Completa los campos del formulario:
   - Nombre de la configuración
   - Ruta del directorio base
   - Directorios permitidos (opcional)
   - Directorios excluidos
   - Archivos excluidos
   - Extensiones de archivo a incluir
4. Guarda la configuración haciendo clic en "Guardar Configuración".

Ejemplo de configuración:
```json
{
  "name": "Proyecto Web",
  "directoryPath": "C:\\Proyectos\\MiWeb",
  "allowedDirectories": ["src", "public"],
  "excludedDirectories": ["node_modules", "dist"],
  "excludedFiles": ["package-lock.json"],
  "extensions": [".js", ".ts", ".html", ".css"]
}
```

### Generación de Resumen
1. Selecciona la configuración deseada en el menú desplegable.
2. Haz clic en el botón "Generar Resumen".
3. eDev Summary creará un archivo RESUMEN.txt en el directorio base especificado.

## Configuración Detallada

### Opciones de Configuración

| Opción | Descripción | Ejemplo |
|--------|-------------|---------|
| Nombre | Identificador único para la configuración | "Proyecto Web" |
| Ruta del Directorio | Directorio base para el resumen | "C:\\Proyectos\\MiWeb" |
| Directorios Permitidos | Lista de directorios a incluir | ["src", "public"] |
| Directorios Excluidos | Lista de directorios a excluir | ["node_modules", "dist"] |
| Archivos Excluidos | Lista de archivos específicos a excluir | ["package-lock.json", ".DS_Store"] |
| Extensiones | Lista de extensiones de archivo a incluir | [".js", ".ts", ".html", ".css"] |

### Configuración Avanzada
Para usuarios avanzados, eDev Summary permite la personalización a través del archivo `settings.json` de VS Code:

```json
{
  "summary1.configurations": [
    {
      "name": "Proyecto Principal",
      "directoryPath": "C:\\Proyectos\\Principal",
      "allowedDirectories": ["src", "tests"],
      "excludedDirectories": ["node_modules", "build"],
      "excludedFiles": ["*.log", "*.tmp"],
      "extensions": [".js", ".ts", ".css"]
    },
    {
      "name": "Proyecto Secundario",
      "directoryPath": "D:\\Trabajos\\Secundario",
      "allowedDirectories": [],
      "excludedDirectories": ["temp"],
      "excludedFiles": [".env"],
      "extensions": [".py", ".html"]
    }
  ]
}
```

## Comandos
eDev Summary añade los siguientes comandos a VS Code:

- `eDev Summary: Generar Resumen`: Ejecuta el proceso de generación de resumen basado en la configuración seleccionada.

Para acceder a este comando, abre la paleta de comandos (Ctrl+Shift+P) y busca "eDev Summary".

## Ejemplos de Uso

### Ejemplo 1: Resumen de un proyecto React
```json
{
  "name": "Proyecto React",
  "directoryPath": "C:\\Proyectos\\MiAppReact",
  "allowedDirectories": ["src", "public"],
  "excludedDirectories": ["node_modules", "build"],
  "excludedFiles": ["package-lock.json"],
  "extensions": [".js", ".jsx", ".ts", ".tsx", ".css"]
}
```

### Ejemplo 2: Resumen de un backend Node.js
```json
{
  "name": "API Node.js",
  "directoryPath": "/home/usuario/proyectos/mi-api",
  "allowedDirectories": ["src", "tests"],
  "excludedDirectories": ["node_modules", "logs"],
  "excludedFiles": [".env", "*.log"],
  "extensions": [".js", ".ts"]
}
```

### Ejemplo 3: Resumen de un proyecto Python
```json
{
  "name": "Análisis de Datos Python",
  "directoryPath": "D:\\DataScience\\ProyectoAnalisis",
  "allowedDirectories": ["scripts", "notebooks"],
  "excludedDirectories": ["venv", "__pycache__"],
  "excludedFiles": ["*.pyc"],
  "extensions": [".py", ".ipynb"]
}
```

## Casos de Uso

### 1. Onboarding de Nuevos Desarrolladores
Genera un resumen con eDev Summary que incluya los archivos principales y la estructura de directorios. El nuevo desarrollador puede revisar este resumen para obtener una visión general del proyecto antes de profundizar en el código.

### 2. Documentación Rápida para Reuniones
Utiliza eDev Summary para generar un resumen que incluya los archivos más importantes y relevantes para la discusión. Esto proporciona un punto de referencia rápido durante la reunión.

### 3. Colaboración con IA
Genera un resumen con eDev Summary que incluya las partes relevantes del código. Puedes compartir este resumen con herramientas de IA para obtener análisis o sugerencias sin exponer todo tu código.

## Preguntas Frecuentes

**P: ¿Puedo usar eDev Summary con cualquier lenguaje de programación?**
R: Sí, eDev Summary es agnóstico al lenguaje. Puedes configurarlo para trabajar con cualquier tipo de archivo de texto.

**P: ¿El resumen generado incluye el contenido completo de los archivos?**
R: Sí, el archivo RESUMEN.txt incluye el contenido completo de los archivos seleccionados según tu configuración.

**P: ¿Cuántas configuraciones diferentes puedo tener?**
R: No hay límite en el número de configuraciones que puedes crear y guardar.

## Solución de Problemas

### El resumen no se genera
1. Verifica que la ruta del directorio base sea correcta y accesible.
2. Asegúrate de que hay archivos que coincidan con las extensiones especificadas.
3. Revisa los logs de VS Code para ver si hay errores específicos.

### Archivos inesperados en el resumen
1. Revisa tu configuración de directorios y archivos excluidos.
2. Asegúrate de que las extensiones de archivo estén correctamente especificadas.

## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request en nuestro repositorio de GitHub.


### Versión 1.2.0 (Actual)
- Mejorada la interfaz de usuario para la configuración
- Corregidos bugs menores en la generación de resúmenes

### Versión 1.1.0
- Añadido soporte para exclusión de archivos específicos

### Versión 1.0.0
- Lanzamiento inicial de eDev Summary

## Contribuir
¡Tus contribuciones son bienvenidas! Si tienes sugerencias, reportes de errores o quieres contribuir al código, por favor visita nuestro [repositorio en GitHub](https://github.com/yamidnozu/utilidades/tree/main/vscode-extensiones/ext1/summary1).

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## Contacto
edev.core@gmail.com

---

¡Gracias por usar eDev Summary! Esperamos que esta extensión mejore tu flujo de trabajo de desarrollo.