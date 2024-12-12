# Change Log

Todos los cambios notables en la extensión "eDev Summary" serán documentados en este archivo.

El formato está basado en [Keep a Changelog](http://keepachangelog.com/), y este proyecto adhiere a [Semantic Versioning](http://semver.org/).

---

## [4.0.0] - 2024-12-12

### 🔥 Añadido
- **Vista previa del resumen**: Implementación de una función para previsualizar el árbol de archivos y el conteo total de líneas antes de generar el archivo `RESUMEN.txt`.
- **Soporte multilenguaje**: Añadido soporte para cambiar entre Español e Inglés en la interfaz gráfica.
- **Validación de entradas**: Verificación de configuraciones incompletas, con mensajes de error claros.
- **Carga dinámica de extensiones**: Optimización del análisis para detectar todas las extensiones de archivo presentes y mostrar badges actualizados en tiempo real.
- **Copiado automático al portapapeles**: El contenido del archivo `RESUMEN.txt` se copia automáticamente al portapapeles al generarse.

### ⚙️ Cambiado
- **Optimización de la interfaz gráfica**:
  - Diseño más intuitivo y funcional para gestionar configuraciones.
  - Uso de un toggle visual para activar/desactivar la opción "Mostrar todas las combinaciones de extensiones".
  - Mejora de la visualización del árbol de archivos en la vista previa.
- **Compatibilidad con configuraciones anteriores**:
  - Soporte extendido para cargar configuraciones que no incluyan campos nuevos como `showAllExtensions`.

### 🐛 Arreglado
- Solucionado el problema de exclusión en profundidad para directorios y archivos específicos.
- Resueltos errores menores en el manejo de configuraciones guardadas.

---

## [3.0.0] - 2024-08-18

### 🔧 Cambiado
- Implementación de Webpack para empaquetar y distribuir la extensión de manera más eficiente.

---

## [2.0.0] - 2024-08-17

### 🔥 Añadido
- **Toggle para combinaciones de extensiones**: Nuevo control para mostrar todas las combinaciones de extensiones de archivo en el análisis.
- **Persistencia de preferencias**: El estado del toggle se guarda en las configuraciones.
- **Mejora de la interfaz visual**:
  - Reemplazo de checkbox por toggle switches.
  - Estilo visual refinado.

### ⚙️ Cambiado
- Compatibilidad con configuraciones anteriores sin el campo `showAllExtensions`.

### 🐛 Arreglado
- Solucionado el error de carga de configuraciones debido a campos faltantes.

---

## [1.3.0] - 2024-08-17

### 🔥 Añadido
- Interfaz gráfica integrada en VSCode para configurar de manera visual.
- Visualización dinámica de extensiones detectadas.
- Gestión de configuraciones múltiples.
- Funcionalidad para excluir directorios y archivos específicos.

### ⚙️ Cambiado
- Optimización en la generación de resúmenes.
- Formato del archivo `RESUMEN.txt` mejorado.

### 🐛 Arreglado
- Solucionados problemas relacionados con configuraciones incompletas.

---

## [1.2.0] - 2024-08-01

### 🔥 Añadido
- Exclusión predefinida de directorios y archivos comunes.
- Soporte para patrones glob en exclusión de archivos.

### 🛠️ Mejorado
- Rendimiento optimizado para proyectos grandes.

---

## [1.1.0] - 2024-07-15

### 🔥 Añadido
- Funcionalidad para excluir directorios y archivos.
- Selección de extensiones de archivo para el resumen.

### ⚙️ Cambiado
- Generación de resúmenes más precisa.

---

## [1.0.0] - 2024-07-01

### 🚀 Añadido
- Lanzamiento inicial de eDev Summary.
- Generación básica de resúmenes de proyectos.
- Configuración de la ruta del proyecto.
