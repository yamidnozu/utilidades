// Estado: Funciona ✅
// Elimina carpetas vacias a partir de la ruta donde se ejecuta el script   
const fs = require('fs');
const path = require('path');

function deleteEmptyDirectories(directory) {
    // Lee los contenidos del directorio
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error al leer el directorio ${directory}:`, err);
            return;
        }

        // Promises para esperar a que todas las operaciones se completen
        const promises = files.map((file) => {
            const fullPath = path.join(directory, file.name);

            // Si es un directorio, procesarlo recursivamente
            if (file.isDirectory()) {
                return deleteEmptyDirectories(fullPath);
            }

            // No hacer nada para los archivos
            return Promise.resolve();
        });

        // Espera a que todos los archivos y subdirectorios se procesen
        Promise.all(promises).then(() => {
            // Revisar nuevamente si el directorio está vacío
            fs.readdir(directory, (err, files) => {
                if (err) {
                    console.error(`Error al leer nuevamente el directorio ${directory}:`, err);
                    return;
                }

                if (files.length === 0) {
                    // Si el directorio está vacío, eliminarlo
                    fs.rmdir(directory, (err) => {
                        if (err) {
                            console.error(`Error al eliminar el directorio ${directory}:`, err);
                        } else {
                            console.log(`Directorio eliminado: ${directory}`);
                        }
                    });
                }
            });
        });
    });
}

// Comenzar el proceso desde el directorio actual
deleteEmptyDirectories(process.cwd());
