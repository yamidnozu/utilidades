# Change Log

Todos los cambios notables en la extensión "eDev Summary" serán documentados en este archivo.

El formato está basado en [Keep a Changelog](http://keepachangelog.com/), y este proyecto adhiere a [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2024-08-17

### Añadido
- Opción para mostrar todas las combinaciones de extensiones de archivo mediante un control toggle switch en la interfaz gráfica.
- Persistencia de la preferencia del toggle switch en las configuraciones guardadas.
- Interfaz visual mejorada, con un diseño más alineado y estéticamente agradable.
- Implementación de un toggle switch en lugar de un checkbox para seleccionar si se muestran todas las combinaciones de extensiones.
  
### Cambiado
- Alineación y estilo visual de los controles en la interfaz gráfica, mejorando la usabilidad.
- Adaptación para cargar configuraciones anteriores que no incluyan el nuevo campo `showAllExtensions`, asegurando compatibilidad.

### Arreglado
- Resuelto el problema donde las configuraciones existentes no se cargaban correctamente debido a la ausencia del campo `showAllExtensions`.

## [1.3.0] - 2024-08-17

### Añadido
- Interfaz gráfica de usuario (GUI) integrada en VSCode para una configuración más fácil.
- Análisis dinámico de extensiones de archivo presentes en el proyecto.
- Capacidad para guardar y gestionar múltiples configuraciones.
- Visualización de extensiones de archivo como badges seleccionables.
- Funcionalidad para excluir directorios y archivos específicos.
- Opción para seleccionar carpetas específicas para el análisis.

### Cambiado
- Mejorada la lógica de generación de resúmenes para mayor eficiencia.
- Actualizado el formato del archivo RESUMEN.txt para mejor legibilidad.

### Arreglado
- Solucionados problemas con la actualización de extensiones y el guardado de configuraciones.

## [1.2.0] - 2024-08-01

### Añadido
- Lista predeterminada de directorios y archivos comúnmente excluidos.
- Soporte para patrones glob en la exclusión de archivos.

### Mejorado
- Optimizado el rendimiento para proyectos de gran tamaño.

## [1.1.0] - 2024-07-15

### Añadido
- Funcionalidad para excluir directorios y archivos específicos.
- Opción para seleccionar extensiones de archivo a incluir en el resumen.

### Cambiado
- Ajustada la forma en que se toma y genera el resumen para mejor precisión.

## [1.0.0] - 2024-07-01

### Añadido
- Lanzamiento inicial de eDev Summary.
- Funcionalidad básica para generar resúmenes de proyectos.
- Soporte para configurar la ruta del proyecto.
