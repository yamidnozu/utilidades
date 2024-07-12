const fs = require('fs');
const path = require('path');
const ignore = require('ignore'); // Importa la librería 'ignore' para manejar archivos .gitignore

let ig; // Variable global para almacenar las reglas de .gitignore

/**
 * Carga el archivo .gitignore de un directorio y prepara las reglas de ignorado.
 * 
 * @param {string} directory - Directorio del que cargar el archivo .gitignore.
 */
function loadGitignore(directory) {
    try {
        const gitignorePath = path.join(directory, '.gitignore');
        const gitignore = fs.readFileSync(gitignorePath, 'utf8');
        ig = ignore().add(gitignore); // Añade las reglas de .gitignore a la instancia de ignore
    } catch (err) {
        console.error('Error al leer .gitignore:', err);
        ig = ignore(); // Crea una instancia de ignore vacía en caso de error
    }
}

/**
 * Recorre recursivamente un directorio y renombra los archivos '.spec.ts' a '.spec.ts'.
 * 
 * @param {string} directory - Directorio a recorrer para renombrar archivos.
 */
function renameSpecFiles(directory) {
    const nombrequeesta = '.specListo.ts';
    const nombrequequiero = '.spec.ts';
    // const nombrequeesta = '.spec.ts';
    // const nombrequequiero = '.specListo.ts';

    // const nombrequeesta = '.spec.ts';
    // const nombrequequiero = '.spec☢️.ts';
    // const nombrequeesta = '.spec☢️.ts';
    // const nombrequequiero = '.spec.ts';
    
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach(file => {
            const fullPath = path.join(directory, file.name);

            // Ignora archivos y directorios especificados en .gitignore
            if (ig.ignores(fullPath.replace(/^.\//, ''))) {
                return;
            }

            if (file.isDirectory()) {
                // Si es un directorio, llama recursivamente a la función para procesar archivos internos
                renameSpecFiles(fullPath);
            } else {
                // Si es un archivo y termina en '.spec.ts', lo renombra a '.spec.ts'
                if (file.name.endsWith(nombrequeesta)) {
                    const newFileName = file.name.replace(nombrequeesta, nombrequequiero);
                    const newFullPath = path.join(directory, newFileName);

                    fs.rename(fullPath, newFullPath, err => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log(`Renamed: ${fullPath} -> ${newFullPath}`);
                    });
                }
            }
        });
    });
}
/**
 * Recorre recursivamente un directorio para contar todos los archivos que contienen 'spec' en su nombre.
 * 
 * @param {string} directory - Directorio a recorrer.
 * @param {Object} countMap - Mapa para llevar la cuenta de cada tipo de archivo.
 */
function countSpecFiles(directory, countMap = {}) {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach(file => {
            
            const fullPath = path.join(directory, file.name);

            if (ig.ignores(fullPath.replace(/^.\//, ''))) {
                return;
            }

            if (file.isDirectory()) {
                countSpecFiles(fullPath, countMap); // Recursividad para directorios
            } else {
                const match = file.name.match(/(.*)\.spec(.*)\..*$/i);
                if (match) {
                    const prefix = match[1] || '';
                    const suffix = match[2] || '';
                    const specPattern = `.spec${suffix}`;
                    countMap[specPattern] = (countMap[specPattern] || 0) + 1;
                }
            }
        });
        
        if (path.resolve(directory) === path.resolve('.')) {
            console.log('Count of spec files:', countMap);
        }
        console.log( countMap);
    });
}

// Carga .gitignore desde el directorio actual y empieza el proceso
loadGitignore('.');
renameSpecFiles('.');
countSpecFiles('.'); 
/*
 * Ejemplo de uso:
 * Este script se debe ejecutar en la raíz de un proyecto donde se desea renombrar archivos de test.
 * Los archivos con la extensión '.spec.ts' serán renombrados a '.spec.ts'.
 * El script respetará las exclusiones especificadas en el archivo .gitignore del proyecto.
 * Ejemplo: node esteScript.js
 */
