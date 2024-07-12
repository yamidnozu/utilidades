const fs = require('fs');
const path = require('path');

const ignoredDirs = ['node_modules']; // Directorios a ignorar
const fileExtension = '.ts'; // Extensiones de archivos a procesar

function deleteConsoleLogs(dirPath) {
    fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error('Error al leer el directorio:', err);
            return;
        }
        entries.forEach((entry) => {
            const filePath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                if (!ignoredDirs.includes(entry.name)) {
                    deleteConsoleLogs(filePath);
                }
            } else if (entry.isFile() && path.extname(entry.name) === fileExtension) {
                processFile(filePath);
            }
        });
    });
}

function processFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return;
        }
        // Expresión regular mejorada para eliminar console.log y console.error, incluso si están comentados
        const consolePattern = /(?:\/\/\s*)*console\.(log|error)\s*\(([^)]*)\)\s*;?/g;
        const updatedContent = data.replace(consolePattern, '');
        if (updatedContent !== data) {
            fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo:', err);
                } else {
                    console.log(`Console logs eliminados en: ${filePath}`);
                }
            });
        }
    });
}

// Uso:
const startPath = process.cwd(); // Ruta de inicio actual
deleteConsoleLogs(startPath);
