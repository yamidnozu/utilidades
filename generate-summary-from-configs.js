// const fs = require('fs');
// const path = require('path');

// const directoryPath = path.join(process.cwd(), '');
// const summaryFilePath = path.join(process.cwd(), 'RESUMEN.TXT');

// function shouldExcludeFile(fileName, filePath) {
//   const excludedFolders = ['node_modules', '.angular', '.vscode', 'dist', 'coverage'];
//   const isExcludedFolder = excludedFolders.some(folder => filePath.includes(folder));

//   const isAssetFolder = filePath.split(path.sep).some(part => part.toLowerCase() === 'assets');

//   const isExcludedFile = ['.ts', '.html', '.png', '.svg', '.ttf', 'package.json', 'package-lock.json'].some(ext => fileName.endsWith(ext));

//   return isExcludedFolder || isExcludedFile || isAssetFolder;
// }


// function removeLineComments(content) {
//   return content.replace(/\/\/.*$/gm, '');
// }

// function readFilesAndWriteSummary(dir) {
//   fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
//     const fullPath = path.join(dir, dirent.name);
//     if (dirent.isDirectory()) {
//       readFilesAndWriteSummary(fullPath);
//     } else if (dirent.isFile() && !shouldExcludeFile(dirent.name, fullPath)) {
//       const fileContent = fs.readFileSync(fullPath, 'utf8');
//       const cleanedContent = removeLineComments(fileContent);
//       const relativePath = path.relative(process.cwd(), fullPath);
//       const contentToWrite = `/* Inicio ${relativePath} */\n${cleanedContent}\n/* Fin */\n`;
//       fs.appendFileSync(summaryFilePath, contentToWrite);
//     }
//   });
// }

// if (fs.existsSync(summaryFilePath)) {
//   fs.unlinkSync(summaryFilePath);
// }

// readFilesAndWriteSummary(directoryPath);


const fs = require('fs');
const path = require('path');

const directoryPath = path.join(process.cwd(), '');
const summaryFilePath = path.join(process.cwd(), 'RESUMEN.TXT');

function shouldExcludeFile(fileName, filePath) {
  const excludedFolders = ['node_modules', '.angular', '.vscode', 'dist', 'coverage', 'build'];
  const isExcludedFolder = excludedFolders.some(folder => filePath.includes(folder)) || filePath.includes(path.join('src', 'assets'));

  const isExcludedFile = fileName.endsWith('.ts');
  const isExcludedFileHtml = fileName.endsWith('.html');
  const isExcludedFileOPng = fileName.endsWith('.png');
  const isExcludedFileOSvg = fileName.endsWith('.svg');
  const isExcludedFileOttf = fileName.endsWith('.ttf');
  // ico
  const isExcludedFileOico = fileName.endsWith('.ico');

  return (
    isExcludedFolder ||
    isExcludedFile ||
    fileName === 'package.json' ||
    fileName === 'package-lock.json' ||
    isExcludedFileHtml ||
    isExcludedFileOPng ||
    isExcludedFileOSvg ||
    isExcludedFileOttf ||
    isExcludedFileOico
  );
}

function removeLineComments(content) {
  return content.replace(/\/\/.*$/gm, '');
}

function readFilesAndWriteSummary(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = path.join(dir, dirent.name);

    if (dirent.isDirectory()) {
      readFilesAndWriteSummary(fullPath);
    } else if (dirent.isFile() && !shouldExcludeFile(dirent.name, fullPath)) {
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const cleanedContent = removeLineComments(fileContent);
      const relativePath = path.relative(process.cwd(), fullPath);
      const contentToWrite = `/* Inicio ${relativePath} */\n${cleanedContent}\n/* Fin */\n`;
      fs.appendFileSync(summaryFilePath, contentToWrite);
    }
  });
}

if (fs.existsSync(summaryFilePath)) {
  fs.unlinkSync(summaryFilePath);
}

readFilesAndWriteSummary(directoryPath);