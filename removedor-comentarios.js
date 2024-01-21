/*
 * Ejemplo de uso:
 * Para usar este script, ejecútalo con Node.js, proporcionando la ruta del archivo como argumento.
 * Ejemplo: node removedor.js c:/miarchivo.ts
 * El script leerá el archivo especificado, eliminará todos los comentarios, reducirá los saltos de línea
 * innecesarios y agregará un salto de línea entre las declaraciones de métodos, manteniendo la indentación
 * y el formato del código.
 */


const fs = require('fs');
const path = require('path');

/**
 * Añade un salto de línea entre las declaraciones de métodos en un contenido de archivo.
 * 
 * @param {string} content - El contenido del archivo a procesar.
 * @returns {string} El contenido procesado con saltos de línea adicionales entre métodos.
 */
function addLineBetweenMethods(content) {
    // Divide el contenido en líneas y procesa cada línea
    return content.split('\n').reduce((acc, line, index, lines) => {
        acc.push(line);

        // Si la línea actual termina un método o clase (una '}' sola o con comentarios), y la siguiente línea no está vacía,
        // agrega un salto de línea adicional
        if (line.match(/^\s*}\s*$/) && lines[index + 1] && !lines[index + 1].match(/^\s*$/)) {
            acc.push('');
        }

        return acc;
    }, []).join('\n');
}

/**
 * Elimina los comentarios y reduce los saltos de línea innecesarios en el contenido del archivo.
 * 
 * @param {string} content - El contenido del archivo a procesar.
 * @returns {string} El contenido procesado sin comentarios y con saltos de línea reducidos.
 */
function removeCommentsAndExtraLines(content) {
    // Elimina comentarios de línea y bloque
    let noComments = content.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

    // Reduce los saltos de línea múltiples a un solo salto de línea
    // y mantiene la indentación del código
    let reducedLines = noComments
        .split('\n')
        .map(line => line.trimEnd()) // Elimina espacios al final de cada línea
        .join('\n')
        .replace(/\n\s*\n/g, '\n'); // Reduce múltiples saltos de línea a uno solo

    return addLineBetweenMethods(reducedLines);
}

/**
 * Procesa un archivo eliminando los comentarios y ajustando los saltos de línea.
 * 
 * @param {string} filePath - La ruta del archivo a procesar.
 */
function processFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error al leer el archivo: ${err}`);
            return;
        }

        const processedContent = removeCommentsAndExtraLines(data);

        // Sobrescribe el archivo original
        fs.writeFile(filePath, processedContent, 'utf8', (err) => {
            if (err) {
                console.error(`Error al escribir en el archivo: ${err}`);
            } else {
                console.log(`Archivo procesado exitosamente: ${filePath}`);
            }
        });
    });
}

// Tomar la ruta del archivo desde los argumentos de la línea de comandos
const filePath = process.argv[2];

if (!filePath) {
    console.log('Por favor, proporcione la ruta del archivo como argumento.');
    process.exit(1);
}

// Verifica si el archivo existe
if (!fs.existsSync(filePath)) {
    console.log(`El archivo no existe: ${filePath}`);
    process.exit(1);
}

// Ejecuta el procesamiento del archivo
processFile(filePath);

