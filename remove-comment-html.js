const fs = require('fs');

// Verificar si se proporcionó el argumento del archivo
if (process.argv.length < 3) {
    console.error('Por favor, proporciona el nombre del archivo HTML como argumento.');
    process.exit(1);
}

// Obtener el nombre del archivo desde los argumentos
const fileName = process.argv[2];

// Función para eliminar comentarios y atributos específicos
function removeUnwantedContent(content) {
    // Eliminar comentarios específicos
    content = content
        .replace(/<!--bindings={[\s\S]*?}-->/g, '')
        .replace(/<!--ng-container-->/g, '')
        .replace(/<!--container-->/g, '')
        .replace(/\/\*# sourceMappingURL=data:application\/json[^*]*\*\//g, '');

    // Eliminar atributos específicos
    content = content.replace(/\s*ng-reflect-[\w-]+="[^"]*"/g, '');
    content = content.replace(/\s*_ngcontent-[\w-]+=""/g, '');
    content = content.replace(/\s*\[_ngcontent-[\w-]+\]/g, '');

    return content;
}

// Leer el archivo HTML
fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }

    // Eliminar los comentarios y atributos no deseados
    const cleanedData = removeUnwantedContent(data);

    // Sobrescribir el archivo original con el contenido modificado
    fs.writeFile(fileName, cleanedData, 'utf8', (err) => {
        if (err) {
            console.error('Error al escribir el archivo:', err);
            return;
        }
        console.log('Archivo modificado correctamente.');
    });
});
