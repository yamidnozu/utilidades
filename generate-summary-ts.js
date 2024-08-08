const fs = require('fs');
const path = require('path');

// Use process.cwd() to get the current directory from where the script is run
const directoryPath = path.join(process.cwd(), '');
const summaryFilePath = path.join(process.cwd(), 'RESUMEN.TXT');

// Directorios permitidos
const allowedDirectories = [
    'filterable-table-widget',

    // Agrega más rutas aquí
];

// Función para verificar si el archivo debe ser excluido
function shouldExcludeFile(fileName) {
    return /\.spec?(\.ts)?$/.test(fileName);
}

// Función para eliminar los comentarios de línea
function removeLineComments(content) {
    return content.replace(/\/\/.*$/gm, '');
}

// Función para verificar si el archivo está dentro de los directorios permitidos
function isInAllowedDirectory(filePath) {
    return allowedDirectories.some((dir) => filePath.includes(path.normalize(dir)));
}

// Función recursiva para leer archivos y escribir el resumen
function readFilesAndWriteSummary(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
        const fullPath = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
            readFilesAndWriteSummary(fullPath); // Llamada recursiva para directorios
        } else if (dirent.isFile() && (dirent.name.endsWith('.ts') || dirent.name.endsWith('.html') || dirent.name.endsWith('.json') || dirent.name.endsWith('.js')) && !shouldExcludeFile(dirent.name)) {
            const relativePath = path.relative(process.cwd(), fullPath);
            if (isInAllowedDirectory(relativePath)) {
                const fileContent = fs.readFileSync(fullPath, 'utf8');
                const cleanedContent = removeLineComments(fileContent);
                const contentToWrite = `/* Inicio ${relativePath} */\n${cleanedContent}\n/* Fin */\n`;
                fs.appendFileSync(summaryFilePath, contentToWrite);
                // console.log(`Procesado: ${relativePath}`);
            } else {
                // console.log(`Excluido (no está en directorios permitidos): ${relativePath}`);
            }
        }
    });
}

// Limpia el archivo RESUMEN.TXT si ya existe
if (fs.existsSync(summaryFilePath)) {
    fs.unlinkSync(summaryFilePath);
}

// Inicia el proceso
readFilesAndWriteSummary(directoryPath);
