"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryViewProvider = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
class SummaryViewProvider {
    _extensionUri;
    static viewType = 'summaryConfigView';
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getWebviewContent(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'saveConfig':
                    await this.saveConfiguration(message);
                    await this.sendConfigsToWebview(webviewView.webview);
                    break;
                case 'runSummary':
                    if (message.configName) {
                        await this.runSummary(message.configName);
                    }
                    else {
                        vscode.window.showErrorMessage('No configuration selected.');
                    }
                    break;
                case 'getConfigs':
                    await this.sendConfigsToWebview(webviewView.webview);
                    break;
                case 'deleteConfig':
                    if (message.configName) {
                        await this.deleteConfiguration(message.configName);
                        await this.sendConfigsToWebview(webviewView.webview);
                    }
                    else {
                        vscode.window.showErrorMessage('No configuration selected for deletion.');
                    }
                    break;
                case 'findExtensions':
                    try {
                        const extensions = await this.findExtensions(message.directoryPath, message.allowedDirectories.split(',').map((dir) => dir.trim()), message.excludedDirectories.split(',').map((dir) => dir.trim()), message.excludedFiles.split(',').map((file) => file.trim()));
                        webviewView.webview.postMessage({
                            command: 'setExtensions',
                            extensions: Array.from(extensions)
                        });
                    }
                    catch (error) {
                        console.error('Error finding extensions:', error);
                        webviewView.webview.postMessage({
                            command: 'setExtensions',
                            extensions: []
                        });
                    }
                    break;
            }
        });
        this.sendConfigsToWebview(webviewView.webview);
    }
    async findExtensions(directoryPath, allowedDirectories, excludedDirectories, excludedFiles) {
        const extensions = new Set();
        const isExcluded = (relativePath) => {
            return excludedDirectories.some(excludedDir => relativePath === excludedDir || relativePath.startsWith(excludedDir + path.sep)) || excludedFiles.includes(path.basename(relativePath));
        };
        const processDirectory = (dir) => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const relativePath = path.relative(directoryPath, fullPath);
                if (isExcluded(relativePath)) {
                    continue;
                }
                if (fs.statSync(fullPath).isDirectory()) {
                    if (allowedDirectories.length === 0 || allowedDirectories.some(allowedDir => relativePath.startsWith(allowedDir))) {
                        processDirectory(fullPath);
                    }
                }
                else {
                    const ext = path.extname(file).toLowerCase();
                    if (ext)
                        extensions.add(ext);
                }
            }
        };
        processDirectory(directoryPath);
        return extensions;
    }
    async sendConfigsToWebview(webview) {
        const config = vscode.workspace.getConfiguration('summary1');
        const configurations = config.get('configurations');
        webview.postMessage({
            command: 'setConfigs',
            configurations: configurations.map(c => ({
                ...c,
                allowedDirectories: c.allowedDirectories.join(', '),
                excludedDirectories: c.excludedDirectories.join(', '),
                excludedFiles: c.excludedFiles.join(', ')
            }))
        });
    }
    async saveConfiguration(message) {
        try {
            const config = vscode.workspace.getConfiguration('summary1');
            let configurations = config.get('configurations');
            const newConfig = {
                name: message.name,
                directoryPath: message.directoryPath,
                allowedDirectories: message.allowedDirectories.split(',').map((dir) => dir.trim()),
                excludedDirectories: message.excludedDirectories.split(',').map((dir) => dir.trim()),
                excludedFiles: message.excludedFiles.split(',').map((file) => file.trim()),
                extensions: message.extensions
            };
            const existingIndex = configurations.findIndex(c => c.name === newConfig.name);
            if (existingIndex !== -1) {
                configurations[existingIndex] = newConfig;
            }
            else {
                configurations.push(newConfig);
            }
            await config.update('configurations', configurations, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('Configuración guardada correctamente');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error al guardar la configuración: ${error}`);
        }
    }
    async deleteConfiguration(configName) {
        try {
            const config = vscode.workspace.getConfiguration('summary1');
            let configurations = config.get('configurations');
            configurations = configurations.filter(c => c.name !== configName);
            await config.update('configurations', configurations, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('Configuration deleted successfully!');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to delete configuration: ${error}`);
        }
    }
    async runSummary(configName) {
        const config = vscode.workspace.getConfiguration('summary1');
        const configurations = config.get('configurations');
        const selectedConfig = configurations.find(c => c.name === configName);
        if (!selectedConfig) {
            vscode.window.showErrorMessage('Selected configuration not found.');
            return;
        }
        const { directoryPath, allowedDirectories, excludedDirectories, excludedFiles, extensions } = selectedConfig;
        if (!directoryPath || extensions.length === 0) {
            vscode.window.showErrorMessage('Please configure all settings before running the summary.');
            return;
        }
        try {
            const summaryContent = await this.generateSummary(directoryPath, allowedDirectories, excludedDirectories, excludedFiles, extensions);
            const summaryPath = path.join(directoryPath, 'RESUMEN.TXT');
            fs.writeFileSync(summaryPath, summaryContent);
            vscode.window.showInformationMessage(`Summary completed successfully! Saved to ${summaryPath}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to run summary: ${error}`);
        }
    }
    async generateSummary(directoryPath, allowedDirectories, excludedDirectories, excludedFiles, extensions) {
        let summaryContent = '';
        const isExcluded = (relativePath) => {
            return excludedDirectories.some(excludedDir => relativePath === excludedDir || relativePath.startsWith(excludedDir + path.sep)) || excludedFiles.includes(path.basename(relativePath));
        };
        const processDirectory = (dir) => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const relativePath = path.relative(directoryPath, fullPath);
                if (isExcluded(relativePath)) {
                    continue;
                }
                if (fs.statSync(fullPath).isDirectory()) {
                    if (allowedDirectories.length === 0 || allowedDirectories.some(allowedDir => relativePath.startsWith(allowedDir))) {
                        processDirectory(fullPath);
                    }
                }
                else if (extensions.includes(path.extname(file))) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    summaryContent += `\n/* Inicio ${relativePath} */\n${content}\n/* Fin */\n`;
                }
            }
        };
        processDirectory(directoryPath);
        return summaryContent;
    }
    getWebviewContent(webview) {
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Configuración de Resumen</title>
                <style>
                    body { 
                        padding: 20px; 
                        font-family: Arial, sans-serif; 
                        background-color: #1e1e1e;
                        color: #d4d4d4;
                    }
                    .container {
                        background-color: #252526;
                        border-radius: 8px;
                        padding: 20px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    h1 { 
                        color: #0078D4; 
                        border-bottom: 2px solid #0078D4;
                        padding-bottom: 10px;
                    }
                    input, button, select { 
                        margin-bottom: 15px; 
                        width: 100%; 
                        padding: 8px; 
                        border: 1px solid #6b6b6b;
                        border-radius: 4px;
                        background-color: #3c3c3c;
                        color: #d4d4d4;
                    }
                    button {
                        background-color: #0078D4;
                        color: white;
                        border: none;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }
                    button:hover {
                        background-color: #005a9e;
                    }
                    button:disabled {
                        background-color: #505050;
                        cursor: not-allowed;
                    }
                    label { 
                        display: block; 
                        margin-top: 15px;
                        font-weight: bold;
                    }
                    .example { 
                        font-size: 0.8em; 
                        color: #a0a0a0; 
                        margin-bottom: 5px;
                    }
                    .extension-badges {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        margin-top: 10px;
                    }
                    .extension-badge {
                        background-color: #3c3c3c;
                        padding: 5px 10px;
                        border-radius: 20px;
                        display: flex;
                        align-items: center;
                        user-select: none;
                        cursor: pointer;
                    }
                    .extension-badge.selected {
                        background-color: #0078D4;
                        color: white;
                    }
                    .extension-badge .remove {
                        margin-left: 5px;
                        font-weight: bold;
                    }
                    .loader-container {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 70px;
                    }
                    .loader {
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #3498db;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        animation: spin 1s linear infinite;
                    }
                    .loader-text {
                        margin-top: 10px;
                        font-size: 14px;
                        color: #a0a0a0;
                    }
                    .extension-badge.disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Configurar Extensión</h1>
                    <select id="configSelector">
                        <option value="">Crear nueva configuración</option>
                    </select>
                    <form id="config-form">
                        <label for="configName">Nombre de la Configuración:</label>
                        <input type="text" id="configName" required placeholder="Ingresa el nombre de la configuración">

                        <label for="directoryPath">Ruta del Directorio:</label>
                        <div class="example">Ejemplo: C:\\Proyectos\\MiProyecto</div>
                        <input type="text" id="directoryPath" required placeholder="Ingresa la ruta del directorio base">
                        
                        <label for="allowedDirectories">Directorios Permitidos (separados por comas):</label>
                        <div class="example">Ejemplo: src/app, src/components</div>
                        <input type="text" id="allowedDirectories" placeholder="Ingresa los directorios permitidos">
                        
                        <label for="excludedDirectories">Directorios Excluidos (separados por comas):</label>
                        <div class="example">Ejemplo: node_modules, dist</div>
                        <input type="text" id="excludedDirectories" placeholder="Ingresa los directorios excluidos">
                        
                        <label for="excludedFiles">Archivos Excluidos (separados por comas):</label>
                        <div class="example">Ejemplo: package-lock.json, .gitignore</div>
                        <input type="text" id="excludedFiles" placeholder="Ingresa los archivos excluidos">
                        
                        <label for="extensions">Extensiones de Archivo:</label>
                        <div class="loader-container" id="loaderContainer" style="display: none;">
                            <div class="loader"></div>
                            <div class="loader-text">Actualizando extensiones...</div>
                        </div>
                        <div id="extensionBadges" class="extension-badges"></div>
                        
                        <button type="submit">Guardar Configuración</button>
                    </form>
                    <button id="runSummary">Generar Resumen</button>
                    <button id="deleteConfig">Eliminar Configuración</button>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    const configSelector = document.getElementById('configSelector');
                    const configNameInput = document.getElementById('configName');
                    const directoryPathInput = document.getElementById('directoryPath');
                    const allowedDirectoriesInput = document.getElementById('allowedDirectories');
                    const excludedDirectoriesInput = document.getElementById('excludedDirectories');
                    const excludedFilesInput = document.getElementById('excludedFiles');
                    const extensionBadgesDiv = document.getElementById('extensionBadges');
                    const runSummaryButton = document.getElementById('runSummary');
                    const deleteConfigButton = document.getElementById('deleteConfig');

                    let configurations = [];
                    let selectedExtensions = new Set();

                    // Valores por defecto
                    const defaultExcludedDirectories = [
                            'node_modules',
                            '.git',
                            'dist',
                            'build',
                            'out',
                            'target',
                            '.idea',
                            '.vscode',
                            '.gradle',
                            'bin',
                            'obj',
                            'logs',
                            'temp',
                            'tmp',
                            'cache',
                            'coverage',
                            '__pycache__',
                            'venv',
                            'env',
                            '.next',
                            '.nuxt',
                            'vendor'
                        ].join(', ');
                        const defaultExcludedFiles = [
                            'package-lock.json',
                            '.gitignore',
                            '.DS_Store',
                            'Thumbs.db',
                            '*.log',
                            '*.tmp',
                            '*.temp',
                            '*.swp',
                            '*.bak',
                            '*.class',
                            '*.pyc',
                            '*.pyo',
                            '*.exe',
                            '*.dll',
                            '*.obj',
                            '*.o',
                            '*.a',
                            '*.lib',
                            '*.so',
                            '*.dylib',
                            '*.ncb',
                            '*.sdf',
                            '*.suo',
                            '*.pdb',
                            '*.idb',
                            '.env',
                            '.env.local',
                            '.env.development.local',
                            '.env.test.local',
                            '.env.production.local',
                            'npm-debug.log*',
                            'yarn-debug.log*',
                            'yarn-error.log*',
                            '.pnp.*',
                            '*.sqlite'
                        ].join(', ');

                    // Función para inicializar la interfaz
                    function initializeInterface() {
                        configNameInput.value = '';
                        directoryPathInput.value = '';
                        allowedDirectoriesInput.value = '';
                        excludedDirectoriesInput.value = defaultExcludedDirectories;
                        excludedFilesInput.value = defaultExcludedFiles;
                        selectedExtensions.clear();
                        extensionBadgesDiv.innerHTML = '';
                        runSummaryButton.disabled = true;
                        deleteConfigButton.disabled = true;
                    }

                    // Inicializar la interfaz al cargar
                    initializeInterface();

                    vscode.postMessage({ command: 'getConfigs' });

                    function updateExtensionBadges(extensions) {
                        extensionBadgesDiv.innerHTML = '';
                        extensions.forEach(ext => {
                            const badge = document.createElement('div');
                            badge.className = 'extension-badge' + (selectedExtensions.has(ext) ? ' selected' : '');
                            badge.textContent = ext;
                            badge.onclick = () => toggleExtension(ext, badge);
                            extensionBadgesDiv.appendChild(badge);
                        });
                    }

                    function toggleExtension(ext, badge) {
                        if (!badge.classList.contains('disabled')) {
                            if (selectedExtensions.has(ext)) {
                                selectedExtensions.delete(ext);
                                badge.classList.remove('selected');
                            } else {
                                selectedExtensions.add(ext);
                                badge.classList.add('selected');
                            }
                        }
                    }

                    function toggleExtension(ext, badge) {
                        if (selectedExtensions.has(ext)) {
                            selectedExtensions.delete(ext);
                            badge.classList.remove('selected');
                        } else {
                            selectedExtensions.add(ext);
                            badge.classList.add('selected');
                        }
                    }

                    function disableBadges() {
                        const badges = extensionBadgesDiv.querySelectorAll('.extension-badge');
                        badges.forEach(badge => {
                            badge.classList.add('disabled');
                            badge.onclick = null;
                        });
                    }

                    function enableBadges() {
                        const badges = extensionBadgesDiv.querySelectorAll('.extension-badge');
                        badges.forEach(badge => {
                            badge.classList.remove('disabled');
                            badge.onclick = () => toggleExtension(badge.textContent, badge);
                        });
                    }

                    function findExtensions() {
                        const directoryPath = directoryPathInput.value;
                        const allowedDirectories = allowedDirectoriesInput.value;
                        const excludedDirectories = excludedDirectoriesInput.value;
                        const excludedFiles = excludedFilesInput.value;

                        if (directoryPath) {
                            document.getElementById('loaderContainer').style.display = 'flex';
                            disableBadges();
                            const startTime = Date.now();
                            
                            vscode.postMessage({
                                command: 'findExtensions',
                                directoryPath,
                                allowedDirectories,
                                excludedDirectories,
                                excludedFiles
                            });

                            window.extensionsReceived = () => {
                                const elapsedTime = Date.now() - startTime;
                                if (elapsedTime < 1000) {
                                    setTimeout(() => {
                                        document.getElementById('loaderContainer').style.display = 'none';
                                        enableBadges();
                                    }, 1000 - elapsedTime);
                                } else {
                                    document.getElementById('loaderContainer').style.display = 'none';
                                    enableBadges();
                                }
                            };
                        }
                    }
                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.command) {
                            case 'setConfigs':
                                configurations = message.configurations;
                                updateConfigSelector();
                                break;
                            case 'setExtensions':
                                updateExtensionBadges(message.extensions);
                                if (window.extensionsReceived) {
                                    window.extensionsReceived();
                                }
                                break;
                        }
                    });

                    function updateConfigSelector() {
                        configSelector.innerHTML = '<option value="">Crear nueva configuración</option>';
                        configurations.forEach(config => {
                            const option = document.createElement('option');
                            option.value = config.name;
                            option.textContent = config.name;
                            configSelector.appendChild(option);
                        });
                    }

                    configSelector.addEventListener('change', (event) => {
                        const selectedConfig = configurations.find(c => c.name === event.target.value);
                        if (selectedConfig) {
                            configNameInput.value = selectedConfig.name;
                            directoryPathInput.value = selectedConfig.directoryPath;
                            allowedDirectoriesInput.value = selectedConfig.allowedDirectories;
                            excludedDirectoriesInput.value = selectedConfig.excludedDirectories || defaultExcludedDirectories;
                            excludedFilesInput.value = selectedConfig.excludedFiles || defaultExcludedFiles;
                            selectedExtensions = new Set(selectedConfig.extensions.map(ext => ext.toLowerCase()));
                            updateExtensionBadges(selectedConfig.extensions);
                            runSummaryButton.disabled = false;
                            deleteConfigButton.disabled = false;
                            findExtensions();
                        } else {
                            initializeInterface();
                        }
                    });
                    [directoryPathInput, allowedDirectoriesInput, excludedDirectoriesInput, excludedFilesInput].forEach(input => {
                        input.addEventListener('change', findExtensions);
                    });
                    document.getElementById('config-form').addEventListener('submit', (event) => {
                        event.preventDefault();
                        vscode.postMessage({
                            command: 'saveConfig',
                            name: configNameInput.value,
                            directoryPath: directoryPathInput.value,
                            allowedDirectories: allowedDirectoriesInput.value,
                            excludedDirectories: excludedDirectoriesInput.value,
                            excludedFiles: excludedFilesInput.value,
                            extensions: Array.from(selectedExtensions)
                        });
                    });

                    runSummaryButton.addEventListener('click', () => {
                        const selectedConfigName = configSelector.value;
                        if (selectedConfigName) {
                            vscode.postMessage({ 
                                command: 'runSummary',
                                configName: selectedConfigName
                            });
                        } else {
                            vscode.window.showErrorMessage('Por favor, selecciona una configuración antes de generar el resumen.');
                        }
                    });

                    deleteConfigButton.addEventListener('click', () => {
                        if (configSelector.value) {
                            vscode.postMessage({ 
                                command: 'deleteConfig',
                                configName: configSelector.value
                            });
                        }
                    });
                    vscode.postMessage({ command: 'getConfigs' });
                </script>
            </body>
            </html>`;
    }
}
exports.SummaryViewProvider = SummaryViewProvider;
//# sourceMappingURL=SummaryViewProvider.js.map