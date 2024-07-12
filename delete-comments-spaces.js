const fs = require('fs');
const path = require('path');

/**
 * Lista de extensiones de archivo a procesar.
 */
const extensions = new Set(['.js', '.ts', '.jsx']);

/**
 * Función principal que procesa los archivos de manera recursiva en el directorio dado.
 * @param {string} dirPath - Ruta del directorio a procesar.
 */
async function processDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        await processDirectory(filePath);
      } else if (file.isFile() && extensions.has(path.extname(file.name))) {
        await processFile(filePath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}: ${error}`);
  }
}

/**
 * Procesa el contenido de un archivo: elimina comentarios, ajusta espacios en blanco, elimina console.log, y escapa rutas de importación.
 * @param {string} filePath - Ruta del archivo a procesar.
 */
async function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = removeComments(content);
    content = removeConsoleLogsAndTables(content);
    content = escapeBackslashesInImports(content);
    content = adjustWhitespace(content);
    fs.writeFileSync(filePath, content, 'utf8');
    // console.log(`File processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error}`);
  }
}

/**
 * Elimina comentarios de una sola línea y de múltiples líneas.
 * @param {string} content - Contenido del archivo.
 * @return {string} - Contenido sin comentarios.
 */
function removeComments(content) {
  const lines = content.split('\n');
  const processedLines = lines.map(line => {
    if (line.trim().startsWith('//')) {
      return '';
    } else {
      return line.replace(/\/\/\s.*/g, '');
    }
  });
  const processedContent = processedLines.join('\n');
  return processedContent.replace(/\/\*[\s\S]*?\*\//gm, '');
}

/**
 * Elimina todas las llamadas a console.log y console.table.
 * @param {string} content - Contenido del archivo.
 * @return {string} - Contenido sin console.log ni console.table.
 */
function removeConsoleLogsAndTables(content) {
  return content.replace(/console\.(log|table)\(.*?\);?/g, '');
}

/**
 * Escapa barras inversas solo en las rutas de importación, sin afectar URLs.
 * @param {string} content - Contenido del archivo.
 * @return {string} - Contenido con rutas de importación correctamente escapadas.
 */
function escapeBackslashesInImports(content) {
  return content.replace(/(import\s+.*?from\s+['"])([^'"]*)(['"])/g, (match, p1, p2, p3) => {
    return p1 + p2.replace(/\\/g, '\\\\') + p3;
  });
}

/**
 * Ajusta espacios en blanco y asegura un espacio adicional antes de declaraciones de funciones y métodos.
 * @param {string} content - Contenido del archivo.
 * @return {string} - Contenido ajustado.
 */
function adjustWhitespace(content) {
  return content
    .replace(/\s+$/gm, '') // Elimina espacios al final de cada línea.
    .replace(/\n\n+/g, '\n\n') // Normaliza saltos de línea.
    .replace(/(function|const|let|var)(\s+)/g, '$1 '); // Asegura un espacio antes de declaraciones.
}

// Inicia el proceso desde el directorio actual.
processDirectory(process.cwd()).then(() => {
  // console.log('Processing complete.');
}).catch(error => {
  console.error(`An error occurred: ${error}`);
});
