import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

interface ConfigurationItem {
    name: string;
    directoryPath: string;
    allowedDirectories: string[];
    excludedDirectories: string[];
    excludedFiles: string[];
    extensions: string[];
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
                                message.excludedFiles.split(',').map((file: string) => file.trim())
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

    private async findExtensions(directoryPath: string, allowedDirectories: string[], excludedDirectories: string[], excludedFiles: string[]): Promise<Set<string>> {
        const extensions = new Set<string>();

        const isExcluded = (relativePath: string) => {
            return excludedDirectories.some(excludedDir =>
                relativePath === excludedDir || relativePath.startsWith(excludedDir + path.sep)
            ) || excludedFiles.includes(path.basename(relativePath));
        };

        const processDirectory = (dir: string) => {
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
                } else {
                    const ext = path.extname(file).toLowerCase();
                    if (ext) extensions.add(ext);
                }
            }
        };

        processDirectory(directoryPath);
        return extensions;
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
                excludedFiles: c.excludedFiles.join(', ')
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
                extensions: message.extensions
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
            vscode.window.showInformationMessage('Configuration deleted successfully!');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to delete configuration: ${error}`);
        }
    }

    public async runSummary(configName: string) {
        const config = vscode.workspace.getConfiguration('summary1');
        const configurations = config.get('configurations') as ConfigurationItem[];
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
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to run summary: ${error}`);
        }
    }

    private async generateSummary(directoryPath: string, allowedDirectories: string[], excludedDirectories: string[], excludedFiles: string[], extensions: string[]): Promise<string> {
        let summaryContent = '';

        const isExcluded = (relativePath: string) => {
            return excludedDirectories.some(excludedDir =>
                relativePath === excludedDir || relativePath.startsWith(excludedDir + path.sep)
            ) || excludedFiles.includes(path.basename(relativePath));
        };

        const processDirectory = (dir: string) => {
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
                } else if (extensions.includes(path.extname(file))) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    summaryContent += `\n/* Inicio ${relativePath} */\n${content}\n/* Fin */\n`;
                }
            }
        };

        processDirectory(directoryPath);
        return summaryContent;
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
                        --foreground: #d4d4d4;
                        --primary: #0078D4;
                        --secondary: #3a3d41;
                        --accent: #569cd6;
                        --error: #f48771;
                        --success: #89d185;
                    }
                    body { 
                        padding: 20px; 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                        background-color: var(--background);
                        color: var(--foreground);
                        line-height: 1.6;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        background-color: #252526;
                        border-radius: 8px;
                        padding: 30px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    h1 { 
                        color: var(--accent);
                        border-bottom: 2px solid var(--accent);
                        padding-bottom: 15px;
                        margin-bottom: 25px;
                        text-align: center;
                        font-size: 24px;
                    }
                    label { 
                        display: block; 
                        margin-top: 15px;
                        font-weight: bold;
                        color: var(--accent);
                    }
                    input, select { 
                        width: 100%; 
                        padding: 10px; 
                        margin-top: 5px;
                        margin-bottom: 20px; 
                        border: 1px solid var(--secondary);
                        border-radius: 4px;
                        background-color: var(--secondary);
                        color: var(--foreground);
                        font-size: 14px;
                        box-sizing: border-box;
                    }
                    input:focus, select:focus {
                        outline: none;
                        border-color: var(--primary);
                        box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.2);
                    }
                    .example { 
                        font-size: 12px; 
                        color: #a0a0a0; 
                        margin-bottom: 5px;
                    }
                    .extension-badges {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        margin-top: 10px;
                        margin-bottom: 20px;
                        justify-content: center;
                    }
                    .extension-badge {
                        background-color: var(--secondary);
                        color: var(--foreground);
                        padding: 8px 15px;
                        border-radius: 20px;
                        font-size: 12px;
                        display: flex;
                        align-items: center;
                        user-select: none;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .extension-badge.selected {
                        background-color: var(--primary);
                        color: white;
                    }
                    .extension-badge:hover {
                        background-color: var(--accent);
                        color: var(--background);
                    }
                    .button-group {
                        display: flex;
                        gap: 15px;
                        margin-top: 30px;
                    }
                    button {
                        flex: 1;
                        padding: 12px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.2s ease;
                        font-size: 14px;
                        text-transform: uppercase;
                    }
                    button[type="submit"] {
                        background-color: var(--primary);
                        color: white;
                    }
                    button[type="submit"]:hover {
                        background-color: #005a9e;
                    }
                    #runSummary {
                        background-color: var(--success);
                        color: var(--background);
                    }
                    #runSummary:hover {
                        background-color: #6abf69;
                    }
                    #deleteConfig {
                        background-color: var(--error);
                        color: white;
                    }
                    #deleteConfig:hover {
                        background-color: #d9391c;
                    }
                    .loader-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 50px;
                    }
                    .loader {
                        border: 3px solid var(--secondary);
                        border-top: 3px solid var(--primary);
                        border-radius: 50%;
                        width: 24px;
                        height: 24px;
                        animation: spin 1s linear infinite;
                    }
                    #loaderText {
                        margin-left: 10px;
                        color: var(--foreground);
                        font-size: 14px;
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
                        <input type="text" id="configName" required placeholder="Ingrese el nombre de la configuración">

                        <label for="directoryPath">Ruta del Directorio:</label>
                        <div class="example">Ejemplo: C:\Proyectos\MiProyecto</div>
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
                            badge.classList.add('disabled');  // Add this line
                            extensionBadgesDiv.appendChild(badge);
                        });
                        disableBadges();  // Ensure all badges are disabled
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
                                excludedFiles
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
            </html>
        `;
    }
}