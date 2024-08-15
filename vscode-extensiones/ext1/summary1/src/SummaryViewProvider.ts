import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

interface ConfigurationItem {
    name: string;
    directoryPath: string;
    allowedDirectories: string[];
    excludedDirectories: string[];
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
                        await this.saveConfiguration(message);
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
                    case 'scanDirectory':
                        const extensions = await this.scanDirectoryForExtensions(message.directoryPath);
                        webviewView.webview.postMessage({ command: 'setExtensions', extensions });
                        break;
                }
            }
        );

        this.sendConfigsToWebview(webviewView.webview);
    }


    private async scanDirectoryForExtensions(directoryPath: string): Promise<string[]> {
        const extensions = new Set<string>();
        const config = vscode.workspace.getConfiguration('summary1');
        const configurations = config.get('configurations') as ConfigurationItem[];
        const currentConfig = configurations.find(c => c.directoryPath === directoryPath);
        const excludedDirectories = currentConfig ? currentConfig.excludedDirectories : [];

        const scanDir = async (dir: string) => {
            const entries = await fs.promises.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = path.relative(directoryPath, fullPath);

                if (excludedDirectories.some(excludedDir => relativePath.startsWith(excludedDir))) {
                    continue;
                }

                if (entry.isDirectory()) {
                    await scanDir(fullPath);
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name).toLowerCase();
                    if (ext) {
                        extensions.add(ext);
                    }
                }
            }
        };

        try {
            await scanDir(directoryPath);
        } catch (error) {
            console.error('Error scanning directory:', error);
        }

        return Array.from(extensions);
    }
    private async sendConfigsToWebview(webview: vscode.Webview) {
        const config = vscode.workspace.getConfiguration('summary1');
        const configurations = config.get('configurations') as ConfigurationItem[];

        configurations.forEach(conf => {
            conf.extensions = conf.extensions.map(ext => ext.toLowerCase());
        });

        webview.postMessage({
            command: 'setConfigs',
            configurations
        });

        // Scan for extensions if there's at least one configuration
        if (configurations.length > 0) {
            const extensions = await this.scanDirectoryForExtensions(configurations[0].directoryPath);
            webview.postMessage({ command: 'setExtensions', extensions });
        }
    }

    private async saveConfiguration(message: any) {
        try {
            const config = vscode.workspace.getConfiguration('summary1');
            let configurations = config.get('configurations') as ConfigurationItem[];

            const newConfig: ConfigurationItem = {
                name: message.name,
                directoryPath: message.directoryPath,
                allowedDirectories: message.allowedDirectories.split(',').map((dir: string) => dir.trim()),
                excludedDirectories: message.excludedDirectories.split(',').map((dir: string) => dir.trim()),
                extensions: message.extensions
            };

            const existingIndex = configurations.findIndex(c => c.name === newConfig.name);
            if (existingIndex !== -1) {
                configurations[existingIndex] = newConfig;
            } else {
                configurations.push(newConfig);
            }

            await config.update('configurations', configurations, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('Configuration saved successfully!');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to save configuration: ${error}`);
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

        const { directoryPath, allowedDirectories, excludedDirectories, extensions } = selectedConfig;

        if (!directoryPath || allowedDirectories.length === 0 || extensions.length === 0) {
            vscode.window.showErrorMessage('Please configure all settings before running the summary.');
            return;
        }

        try {
            const summaryContent = await this.generateSummary(directoryPath, allowedDirectories, excludedDirectories, extensions);

            const summaryPath = path.join(directoryPath, 'RESUMEN.TXT');
            fs.writeFileSync(summaryPath, summaryContent);

            vscode.window.showInformationMessage(`Summary completed successfully! Saved to ${summaryPath}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to run summary: ${error}`);
        }
    }

    private async generateSummary(directoryPath: string, allowedDirectories: string[], excludedDirectories: string[], extensions: string[]): Promise<string> {
        let summaryContent = '';

        const isExcluded = (relativePath: string) => {
            return excludedDirectories.some(excludedDir =>
                relativePath === excludedDir || relativePath.startsWith(excludedDir + path.sep)
            );
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
                    if (allowedDirectories.some(allowedDir => relativePath.startsWith(allowedDir))) {
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
                <title>Configuración de ResumenCódigo</title>
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
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Configurar Extensión ResumenCódigo</h1>
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
                    <input type="text" id="allowedDirectories" required placeholder="Ingresa los directorios permitidos">
                    
                    <label for="excludedDirectories">Directorios Excluidos (separados por comas):</label>
                    <div class="example">Ejemplo: node_modules, dist</div>
                    <input type="text" id="excludedDirectories" placeholder="Ingresa los directorios excluidos">
                    
                    <label for="extensions">Extensiones de Archivo:</label>
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
                const extensionBadgesDiv = document.getElementById('extensionBadges');
                const runSummaryButton = document.getElementById('runSummary');
                const deleteConfigButton = document.getElementById('deleteConfig');

                let configurations = [];
                let selectedExtensions = new Set();

                vscode.postMessage({ command: 'getConfigs' });

                directoryPathInput.addEventListener('input', debounce(async () => {
                    const directoryPath = directoryPathInput.value;
                    if (directoryPath) {
                        vscode.postMessage({ command: 'scanDirectory', directoryPath });
                    }
                }, 500));

                function debounce(func, wait) {
                    let timeout;
                    return function executedFunction(...args) {
                        const later = () => {
                            clearTimeout(timeout);
                            func(...args);
                        };
                        clearTimeout(timeout);
                        timeout = setTimeout(later, wait);
                    };
                }

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
                    if (selectedExtensions.has(ext)) {
                        selectedExtensions.delete(ext);
                        badge.classList.remove('selected');
                    } else {
                        selectedExtensions.add(ext);
                        badge.classList.add('selected');
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
                        allowedDirectoriesInput.value = selectedConfig.allowedDirectories.join(', ');
                        excludedDirectoriesInput.value = selectedConfig.excludedDirectories.join(', ');
                        selectedExtensions = new Set(selectedConfig.extensions.map(ext => ext.toLowerCase()));
                        vscode.postMessage({ command: 'scanDirectory', directoryPath: selectedConfig.directoryPath });
                        runSummaryButton.disabled = false;
                        deleteConfigButton.disabled = false;
                    } else {
                        configNameInput.value = '';
                        directoryPathInput.value = '';
                        allowedDirectoriesInput.value = '';
                        excludedDirectoriesInput.value = '';
                        selectedExtensions.clear();
                        extensionBadgesDiv.innerHTML = '';
                        runSummaryButton.disabled = true;
                        deleteConfigButton.disabled = true;
                    }
                });

                document.getElementById('config-form').addEventListener('submit', (event) => {
                    event.preventDefault();
                    vscode.postMessage({
                        command: 'saveConfig',
                        name: configNameInput.value,
                        directoryPath: directoryPathInput.value,
                        allowedDirectories: allowedDirectoriesInput.value,
                        excludedDirectories: excludedDirectoriesInput.value,
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
                        vscode.postMessage({
                            command: 'showError',
                            message: 'Por favor, selecciona una configuración antes de generar el resumen.'
                        });
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
            </script>
        </body>
        </html>`;
    }
}