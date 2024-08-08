const fs = require('fs');
const path = require('path');

// Configuraciones y rutas
const directoryPath = path.join(process.cwd(), '');
const summaryFilePath = path.join(process.cwd(), 'RESUMEN.TXT');

// Directorios permitidos
const allowedDirectories = [
  'payment-flow-widget/src/lib',
  // Agrega más rutas aquí
];

// Extensiones de archivo a procesar
const extensions = new Set(['.js', '.ts', '.jsx', '.html', '.json']);

// Verifica si el archivo debe ser excluido
function shouldExcludeFile(fileName) {
  return /\.spec?(\.ts)?$/.test(fileName);
}

// Verifica si el archivo está dentro de los directorios permitidos
function isInAllowedDirectory(filePath) {
  return allowedDirectories.some((dir) => filePath.includes(path.normalize(dir)));
}

// Elimina comentarios de una sola línea y de múltiples líneas
function removeComments(content) {
  const lines = content.split('\n');
  const processedLines = lines.map((line) => {
    if (line.trim().startsWith('//')) {
      return '';
    } else {
      return line.replace(/\/\/\s.*/g, '');
    }
  });
  const processedContent = processedLines.join('\n');
  return processedContent.replace(/\/\*[\s\S]*?\*\//gm, '');
}

// Elimina todas las llamadas a console.log y console.table
function removeConsoleLogsAndTables(content) {
  return content.replace(/console\.(log|table)\(.*?\);?/g, '');
}

// Escapa barras inversas solo en las rutas de importación, sin afectar URLs
function escapeBackslashesInImports(content) {
  return content.replace(/(import\s+.*?from\s+['"])([^'"]*)(['"])/g, (match, p1, p2, p3) => {
    return p1 + p2.replace(/\\/g, '\\\\') + p3;
  });
}

// Ajusta espacios en blanco y asegura un espacio adicional antes de declaraciones de funciones y métodos
function adjustWhitespace(content) {
  return content
    .replace(/\s+$/gm, '') // Elimina espacios al final de cada línea.
    .replace(/\n\n+/g, '\n\n') // Normaliza saltos de línea.
    .replace(/(function|const|let|var)(\s+)/g, '$1 '); // Asegura un espacio antes de declaraciones.
}

// Procesa el contenido de un archivo
function processFileContent(content) {
  content = removeComments(content);
  content = removeConsoleLogsAndTables(content);
  content = escapeBackslashesInImports(content);
  content = adjustWhitespace(content);
  return content;
}

// Función recursiva para leer archivos y escribir el resumen
function readFilesAndWriteSummary(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      readFilesAndWriteSummary(fullPath); // Llamada recursiva para directorios
    } else if (
      dirent.isFile() &&
      extensions.has(path.extname(dirent.name)) &&
      !shouldExcludeFile(dirent.name)
    ) {
      const relativePath = path.relative(process.cwd(), fullPath);
      if (isInAllowedDirectory(relativePath)) {
        let fileContent = fs.readFileSync(fullPath, 'utf8');
        const cleanedContent = processFileContent(fileContent);
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
