# eDev Summary

## Descripción
eDev Summary es una poderosa extensión para Visual Studio Code que te permite generar resúmenes de código fuente de manera rápida y eficiente. Diseñada para desarrolladores que necesitan una visión general de sus proyectos, esta herramienta te ayuda a crear resúmenes personalizados de tus archivos de código, facilitando la documentación y el análisis de proyectos complejos.

## Características principales
- 📁 Selección flexible de directorios y archivos
- 🚫 Exclusión de carpetas específicas
- 📄 Soporte para múltiples extensiones de archivo
- 🔧 Configuraciones personalizables y reutilizables
- 📊 Generación rápida de resúmenes en formato TXT

## Instalación
1. Abre Visual Studio Code
2. Ve a la pestaña de Extensiones (Ctrl+Shift+X)
3. Busca "eDev Summary"
4. Haz clic en "Instalar"

## Uso rápido
1. Abre la barra lateral de eDev Summary en VS Code
2. Crea una nueva configuración o selecciona una existente
3. Configura los directorios, exclusiones y extensiones de archivo
4. Haz clic en "Generar Resumen"
5. ¡Listo! Tu resumen se generará en un archivo RESUMEN.TXT

## Guía detallada

### Crear una nueva configuración
1. En la barra lateral de eDev Summary, selecciona "Crear nueva configuración"
2. Completa los siguientes campos:
   - Nombre de la Configuración: Un nombre único para identificar esta configuración
   - Ruta del Directorio: La ruta base de tu proyecto (ej. C:\\Proyectos\\MiProyecto)
   - Directorios Permitidos: Lista de subdirectorios a incluir, separados por comas (ej. src/app, src/components)
   - Directorios Excluidos: Lista de subdirectorios a excluir, separados por comas (ej. node_modules, dist)
   - Extensiones de Archivo: Selecciona las extensiones de archivo a incluir en el resumen
3. Haz clic en "Guardar Configuración"

### Generar un resumen
1. Selecciona una configuración existente del menú desplegable
2. Haz clic en el botón "Generar Resumen"
3. eDev Summary creará un archivo RESUMEN.TXT en la ruta base especificada en la configuración

### Ejemplo de uso
Supongamos que tienes un proyecto React con la siguiente estructura:

```
MiProyectoReact/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── pages/
│   │   ├── Home.js
│   │   └── About.js
│   └── App.js
├── public/
│   └── index.html
└── node_modules/
```

Para crear un resumen de los archivos JavaScript en la carpeta `src`, excluyendo `node_modules`, podrías configurar eDev Summary así:

1. Nombre de la Configuración: MiProyectoReact
2. Ruta del Directorio: C:\\Proyectos\\MiProyectoReact
3. Directorios Permitidos: src
4. Directorios Excluidos: node_modules
5. Extensiones de Archivo: .js

El resumen generado incluiría el contenido de App.js, Header.js, Footer.js, Home.js y About.js.

## Consejos y trucos
- Usa múltiples configuraciones para diferentes aspectos de tu proyecto. Por ejemplo, una para el frontend y otra para el backend.
- Actualiza tus configuraciones a medida que tu proyecto evoluciona para mantener tus resúmenes relevantes.
- Utiliza los resúmenes generados para documentación rápida, revisiones de código o para obtener una visión general del proyecto.

## Solución de problemas
- Si no se genera el resumen, verifica que la ruta del directorio sea correcta y que tengas permisos de escritura.
- Asegúrate de que las extensiones de archivo seleccionadas coincidan con los tipos de archivo en tu proyecto.
- Si faltan archivos en el resumen, revisa la configuración de directorios permitidos y excluidos.

## Contribuir
¡Tus contribuciones son bienvenidas! Si tienes sugerencias, reportes de errores o quieres contribuir al código, por favor visita nuestro [repositorio en GitHub](https://github.com/yamidnozu/utilidades/tree/main/vscode-extensiones/ext1/summary1).

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## Contacto
Si tienes preguntas o comentarios, no dudes en contactarnos en [edev.core@gmail.com](mailto:edev.core@gmail.com).

---

Esperamos que eDev Summary te ayude a mejorar tu flujo de trabajo de desarrollo. ¡Feliz codificación!
