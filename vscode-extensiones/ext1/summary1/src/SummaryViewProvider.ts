import * as fs from 'fs';
import micromatch from 'micromatch';
import * as path from 'path';
import * as vscode from 'vscode';

interface ConfigurationItem {
    name: string;
    directoryPath: string;
    allowedDirectories: string[];
    excludedDirectories: string[];
    excludedFiles: string[];
    extensions: string[];
    showAllExtensions: boolean; // Nueva propiedad para indicar si se deben mostrar todas las combinaciones de extensiones
}

export class SummaryViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'summaryConfigView';

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getWebviewContent(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'saveConfig':
                        try {
                            const savedConfigName = await this.saveConfiguration(message);
                            await this.sendConfigsToWebview(webviewView.webview);
                            webviewView.webview.postMessage({ command: 'configSaved', configName: savedConfigName });
                        } catch (error) {
                            console.error('Error saving configuration:', error);
                        }
                        break;
                    case 'runSummary':
                        if (message.configName) {
                            await this.runSummary(message.configName);
                        } else {
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
                        } else {
                            vscode.window.showErrorMessage('No configuration selected for deletion.');
                        }
                        break;
                    case 'findExtensions':
                        try {
                            const extensions = await this.findExtensions(
                                message.directoryPath,
                                message.allowedDirectories.split(',').map((dir: string) => dir.trim()),
                                message.excludedDirectories.split(',').map((dir: string) => dir.trim()),
                                message.excludedFiles.split(',').map((file: string) => file.trim()),
                                message.showAllExtensions // Enviar preferencia para mostrar todas las combinaciones de extensiones
                            );
                            webviewView.webview.postMessage({
                                command: 'setExtensions',
                                extensions: Array.from(extensions)
                            });
                        } catch (error) {
                            console.error('Error finding extensions:', error);
                            webviewView.webview.postMessage({
                                command: 'setExtensions',
                                extensions: []
                            });
                        }
                        break;
                }
            }
        );

        this.sendConfigsToWebview(webviewView.webview);
    }

    private async findExtensions(directoryPath: string, allowedDirectories: string[], excludedDirectories: string[], excludedFiles: string[], showAllExtensions: boolean): Promise<Set<string>> {
        const extensions = new Set<string>();

        const isExcluded = (relativePath: string) => {
            const normalizedPath = this.normalizePath(relativePath);
            return micromatch.isMatch(normalizedPath, excludedDirectories.map(this.normalizePath)) || 
                   micromatch.isMatch(path.basename(normalizedPath), excludedFiles);
        };

        const processDirectory = (dir: string, basePath: string) => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const relativePath = path.relative(basePath, fullPath);

                if (isExcluded(relativePath)) {
                    continue;
                }

                if (fs.statSync(fullPath).isDirectory()) {
                    processDirectory(fullPath, basePath); // Recursively process subdirectories
                } else {
                    const parts = file.split('.');
                    if (parts.length > 1) {
                        if (showAllExtensions) {
                            for (let i = 1; i < parts.length; i++) {
                                const ext = '.' + parts.slice(i).join('.').toLowerCase();
                                extensions.add(ext);
                            }
                        } else {
                            const ext = '.' + parts[parts.length - 1].toLowerCase();
                            extensions.add(ext);
                        }
                    }
                }
            }
        };

        if (allowedDirectories.length > 0) {
            for (const allowedDir of allowedDirectories) {
                const fullAllowedPath = path.join(directoryPath, allowedDir);
                if (fs.existsSync(fullAllowedPath)) {
                    processDirectory(fullAllowedPath, directoryPath);
                }
            }
        } else {
            processDirectory(directoryPath, directoryPath);
        }

        return extensions;
    }

    public async runSummary(configName: string) {
        const config = vscode.workspace.getConfiguration('summary1');
        const configurations = config.get('configurations') as ConfigurationItem[];
        const selectedConfig = configurations.find(c => c.name === configName);

        if (!selectedConfig) {
            vscode.window.showErrorMessage('Configuración seleccionada no encontrada.');
            return;
        }

        const { directoryPath, allowedDirectories, excludedDirectories, excludedFiles, extensions, showAllExtensions } = selectedConfig;

        if (!directoryPath || extensions.length === 0) {
            vscode.window.showErrorMessage('Por favor, configure todos los ajustes antes de generar el resumen.');
            return;
        }

        try {
            const summaryContent = await this.generateSummary(directoryPath, allowedDirectories, excludedDirectories, excludedFiles, extensions);

            if (summaryContent.trim() === '') {
                vscode.window.showErrorMessage('No se encontró contenido para el resumen. Verifique las extensiones y directorios seleccionados.');
                return;
            }

            const summaryPath = path.join(directoryPath, 'RESUMEN.TXT');
            fs.writeFileSync(summaryPath, summaryContent);

            vscode.window.showInformationMessage(`Resumen completado con éxito! Guardado en ${summaryPath}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Error al generar el resumen: ${error}`);
        }
    }

    private async generateSummary(directoryPath: string, allowedDirectories: string[], excludedDirectories: string[], excludedFiles: string[], extensions: string[]): Promise<string> {
        let summaryContent = '';

        const isExcluded = (relativePath: string) => {
            const normalizedPath = this.normalizePath(relativePath);
            return micromatch.isMatch(normalizedPath, excludedDirectories.map(this.normalizePath)) || 
                   micromatch.isMatch(path.basename(normalizedPath), excludedFiles);
        };

        const processDirectory = (dir: string, basePath: string) => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const relativePath = path.relative(basePath, fullPath);

                if (isExcluded(relativePath)) {
                    continue;
                }

                if (fs.statSync(fullPath).isDirectory()) {
                    processDirectory(fullPath, basePath); // Recursively process subdirectories
                } else {
                    const parts = file.split('.');
                    if (parts.length > 1) {
                        for (let i = 1; i < parts.length; i++) {
                            const ext = '.' + parts.slice(i).join('.').toLowerCase();
                            if (extensions.includes(ext)) {
                                const content = fs.readFileSync(fullPath, 'utf8');
                                summaryContent += `\n/* Inicio ${relativePath} */\n${content}\n/* Fin ${relativePath} */\n`;
                                break; // Stop after the first matching extension
                            }
                        }
                    }
                }
            }
        };

        if (allowedDirectories.length > 0) {
            for (const allowedDir of allowedDirectories) {
                const fullAllowedPath = path.join(directoryPath, allowedDir);
                if (fs.existsSync(fullAllowedPath)) {
                    processDirectory(fullAllowedPath, directoryPath);
                }
            }
        } else {
            processDirectory(directoryPath, directoryPath);
        }

        return summaryContent;
    }

    private normalizePath(inputPath: string): string {
        let normalized = inputPath.replace(/\\/g, '/');
        normalized = normalized.replace(/([^:])\/+/g, '$1/');
        return normalized;
    }

    private async sendConfigsToWebview(webview: vscode.Webview) {
        const config = vscode.workspace.getConfiguration('summary1');
        const configurations = config.get('configurations') as ConfigurationItem[];
    
        webview.postMessage({
            command: 'setConfigs',
            configurations: configurations.map(c => ({
                ...c,
                allowedDirectories: c.allowedDirectories.join(', '),
                excludedDirectories: c.excludedDirectories.join(', '),
                excludedFiles: c.excludedFiles.join(', '),
                showAllExtensions: c.showAllExtensions !== undefined ? c.showAllExtensions : false // Establecer un valor por defecto si no está presente
            }))
        });
    }   

    private async saveConfiguration(message: any): Promise<string> {
        try {
            const config = vscode.workspace.getConfiguration('summary1');
            let configurations = config.get('configurations') as ConfigurationItem[];

            const newConfig: ConfigurationItem = {
                name: message.name,
                directoryPath: message.directoryPath,
                allowedDirectories: message.allowedDirectories.split(',').map((dir: string) => dir.trim()),
                excludedDirectories: message.excludedDirectories.split(',').map((dir: string) => dir.trim()),
                excludedFiles: message.excludedFiles.split(',').map((file: string) => file.trim()),
                extensions: message.extensions,
                showAllExtensions: message.showAllExtensions // Guardar la preferencia de mostrar todas las extensiones
            };

            const existingIndex = configurations.findIndex(c => c.name === newConfig.name);
            if (existingIndex !== -1) {
                configurations[existingIndex] = newConfig;
            } else {
                configurations.push(newConfig);
            }

            await config.update('configurations', configurations, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('Configuración guardada correctamente');
            return newConfig.name;
        } catch (error) {
            vscode.window.showErrorMessage(`Error al guardar la configuración: ${error}`);
            throw error;
        }
    }

    private async deleteConfiguration(configName: string) {
        try {
            const config = vscode.workspace.getConfiguration('summary1');
            let configurations = config.get('configurations') as ConfigurationItem[];
            configurations = configurations.filter(c => c.name !== configName);
            await config.update('configurations', configurations, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('Configuración eliminada exitosamente');
        } catch (error) {
            vscode.window.showErrorMessage(`Error al eliminar la configuración: ${error}`);
        }
    }

    private getWebviewContent(webview: vscode.Webview) {
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Configuración de eDev Summary</title>
                <style>
                    :root {
                        --background: #1e1e1e;
                        --foreground: #e0e0e0;
                        --primary: #2c2c2c;
                        --secondary: #383838;
                        --highlight: #2d8ce2; 
                        --badge-default: #6a6a6a; 
                        --accent: #6a6a6a;
                        --error: #b85c5c;
                        --success: #4caf50;
                        --toggle-off: #888;
                        --toggle-on: #4caf50;
                    }
                    body { 
                        padding: 10px; 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                        background-color: var(--background);
                        color: var(--foreground);
                        line-height: 1.4;
                        margin: 0;
                    }
                    .container {
                        max-width: 500px;
                        background-color: var(--primary);
                        border-radius: 6px;
                        padding: 15px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    }
                    h1 { 
                        color: var(--foreground);
                        margin-bottom: 15px;
                        text-align: center;
                        font-size: 18px;
                    }
                    label { 
                        display: block; 
                        margin-top: 8px;
                        font-weight: bold;
                        color: var(--foreground);
                    }
                    input, select { 
                        width: 100%; 
                        padding: 6px; 
                        margin-top: 4px;
                        margin-bottom: 12px; 
                        border: 1px solid var(--highlight);
                        border-radius: 3px;
                        background-color: var(--secondary);
                        color: var(--foreground);
                        font-size: 13px;
                        box-sizing: border-box;
                    }
                    input:focus, select:focus {
                        outline: none;
                        border-color: var(--highlight);
                        box-shadow: 0 0 0 2px rgba(45, 140, 226, 0.5);
                    }
                    .extension-badges {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 6px;
                        margin-top: 8px;
                    }
                    .extension-badge {
                        background-color: var(--badge-default); 
                        color: var(--foreground);
                        padding: 5px 10px;
                        border-radius: 12px;
                        font-size: 12px;
                        display: flex;
                        align-items: center;
                        user-select: none;
                        cursor: pointer;
                        transition: background-color 0.2s ease;
                    }
                    .extension-badge.selected {
                        background-color: var(--highlight); 
                    }
                    .extension-badge.disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    .button-group {
                        display: flex;
                        gap: 10px;
                        margin-top: 15px;
                    }
                    button {
                        flex: 1;
                        padding: 10px;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background-color 0.2s ease;
                        font-size: 13px;
                        background-color: var(--highlight);
                        color: white;
                    }
                    button:hover {
                        background-color: #1b6fb2;
                    }
                    .loader-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 40px;
                    }
                    .loader {
                        border: 3px solid var(--primary);
                        border-top: 3px solid var(--highlight);
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        animation: spin 1s linear infinite;
                    }
                    #loaderText {
                        margin-left: 10px;
                        color: var(--foreground);
                        font-size: 13px;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    /* Estilo para el toggle switch */
                    .toggle-container {
                        display: flex;
                        align-items: center;
                        margin-top: 8px;
                        margin-bottom: 12px;
                    }
                    .toggle-switch {
                        position: relative;
                        display: inline-block;
                        width: 40px;
                        height: 20px;
                        margin-right: 10px;
                    }
                    .toggle-switch input {
                        opacity: 0;
                        width: 0;
                        height: 0;
                    }
                    .slider {
                        position: absolute;
                        cursor: pointer;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: var(--toggle-off);
                        transition: .4s;
                        border-radius: 34px;
                    }
                    .slider:before {
                        position: absolute;
                        content: "";
                        height: 14px;
                        width: 14px;
                        left: 3px;
                        bottom: 3px;
                        background-color: white;
                        transition: .4s;
                        border-radius: 50%;
                    }
                    input:checked + .slider {
                        background-color: var(--toggle-on);
                    }
                    input:checked + .slider:before {
                        transform: translateX(20px);
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
                        <input type="text" id="configName" required placeholder="Ingrese el nombre de la configuración">

                        <label for="directoryPath">Ruta del Directorio:</label>
                        <div class="example">Ejemplo: C:/Proyectos/MiProyecto</div>
                        <input type="text" id="directoryPath" required placeholder="Ingrese la ruta del directorio base">
                        
                        <label for="allowedDirectories">Directorios Permitidos:</label>
                        <div class="example">Ejemplo: src/app, src/componentes</div>
                        <input type="text" id="allowedDirectories" placeholder="Ingrese los directorios permitidos (separados por comas)">
                        
                        <label for="excludedDirectories">Directorios Excluidos:</label>
                        <div class="example">Ejemplo: node_modules, dist</div>
                        <input type="text" id="excludedDirectories" placeholder="Ingrese los directorios excluidos (separados por comas)">
                        
                        <label for="excludedFiles">Archivos Excluidos:</label>
                        <div class="example">Ejemplo: package-lock.json, .gitignore</div>
                        <input type="text" id="excludedFiles" placeholder="Ingrese los archivos excluidos (separados por comas)">

                        <div class="toggle-container">
                            <label for="showAllExtensionsCheckbox">Mostrar todas las combinaciones de extensiones:</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="showAllExtensionsCheckbox">
                                <span class="slider"></span>
                            </label>
                        </div>
                        
                        <label for="extensions">Extensiones de Archivo:</label>
                        <div class="loader-container" id="loaderContainer" style="display: none;">
                            <div class="loader"></div>
                            <div id="loaderText" style="margin-left: 10px;">Cargando extensiones...</div>
                        </div>
                        <div id="extensionBadges" class="extension-badges"></div>
                        
                        <div class="button-group">
                            <button type="submit">Guardar</button>
                            <button id="runSummary" type="button">Generar</button>
                            <button id="deleteConfig" type="button">Eliminar</button>
                        </div>
                    </form>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    const configSelector = document.getElementById('configSelector');
                    const configNameInput = document.getElementById('configName');
                    const directoryPathInput = document.getElementById('directoryPath');
                    const allowedDirectoriesInput = document.getElementById('allowedDirectories');
                    const excludedDirectoriesInput = document.getElementById('excludedDirectories');
                    const excludedFilesInput = document.getElementById('excludedFiles');
                    const showAllExtensionsCheckbox = document.getElementById('showAllExtensionsCheckbox');
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
                        showAllExtensionsCheckbox.checked = false;
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
                            badge.classList.add('disabled');
                            extensionBadgesDiv.appendChild(badge);
                        });
                        disableBadges();
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
                        const showAllExtensions = showAllExtensionsCheckbox.checked;

                        if (directoryPath) {
                            const loaderContainer = document.getElementById('loaderContainer');
                            const loaderText = document.getElementById('loaderText');
                            loaderContainer.style.display = 'flex';
                            loaderText.textContent = 'Cargando extensiones...';
                            disableBadges();
                            const startTime = Date.now();
                            
                            vscode.postMessage({
                                command: 'findExtensions',
                                directoryPath,
                                allowedDirectories,
                                excludedDirectories,
                                excludedFiles,
                                showAllExtensions
                            });

                            window.extensionsReceived = () => {
                                const elapsedTime = Date.now() - startTime;
                                if (elapsedTime < 1000) {
                                    setTimeout(() => {
                                        loaderContainer.style.display = 'none';
                                        enableBadges();
                                    }, 1000 - elapsedTime);
                                } else {
                                    loaderContainer.style.display = 'none';
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
                                document.getElementById('loaderText').textContent = 'Actualizando extensiones...';
                                if (window.extensionsReceived) {
                                    window.extensionsReceived();
                                }
                                break;
                            case 'configSaved':
                                configSelector.value = message.configName;
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
                            showAllExtensionsCheckbox.checked = selectedConfig.showAllExtensions !== undefined ? selectedConfig.showAllExtensions : false; // Manejar el valor por defecto
                            updateExtensionBadges(selectedConfig.extensions);
                            runSummaryButton.disabled = false;
                            deleteConfigButton.disabled = false;
                            findExtensions();
                        } else {
                            initializeInterface();
                        }
                    });


                    [directoryPathInput, allowedDirectoriesInput, excludedDirectoriesInput, excludedFilesInput, showAllExtensionsCheckbox].forEach(input => {
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
                            extensions: Array.from(selectedExtensions),
                            showAllExtensions: showAllExtensionsCheckbox.checked
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
            </html>

        `;
    }
}
