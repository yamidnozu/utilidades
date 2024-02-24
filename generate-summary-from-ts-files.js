const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'projects');
const summaryFilePath = path.join(__dirname, 'RESUMEN.TXT');

// Función para verificar si el archivo debe ser excluido
function shouldExcludeFile(fileName) {
    return fileName.endsWith('.mapper.ts') || fileName.endsWith('.spec.ts') || fileName.endsWith('.model.ts') || fileName.endsWith('.component.ts');
}

// Función para eliminar los comentarios de línea
function removeLineComments(content) {
    return content.replace(/\/\/.*$/gm, '');
}

// Función recursiva para leer archivos y escribir el resumen
function readFilesAndWriteSummary(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
        const fullPath = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
            readFilesAndWriteSummary(fullPath); // Llamada recursiva para directorios
        } else if (dirent.isFile() && dirent.name.endsWith('.ts') && !shouldExcludeFile(dirent.name)) {
            const fileContent = fs.readFileSync(fullPath, 'utf8');
            const cleanedContent = removeLineComments(fileContent);
            const relativePath = path.relative(__dirname, fullPath);
            const contentToWrite = `/* Inicio ${relativePath} */\n${cleanedContent}\n/* Fin */\n`;
            fs.appendFileSync(summaryFilePath, contentToWrite);
        }
    });
}

// Limpia el archivo RESUMEN.TXT si ya existe
if (fs.existsSync(summaryFilePath)) {
    fs.unlinkSync(summaryFilePath);
}

// Inicia el proceso
readFilesAndWriteSummary(directoryPath);

