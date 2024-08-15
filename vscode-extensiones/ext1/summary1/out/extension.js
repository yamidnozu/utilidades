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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const SummaryViewProvider_1 = require("./SummaryViewProvider");
function activate(context) {
    console.log('Activating extension');
    const provider = new SummaryViewProvider_1.SummaryViewProvider(context.extensionUri);
    console.log('Provider created');
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(SummaryViewProvider_1.SummaryViewProvider.viewType, provider));
    console.log('Provider registered');
    let disposable = vscode.commands.registerCommand('summary1.runSummary', async () => {
        // Obtener las configuraciones
        const config = vscode.workspace.getConfiguration('summary1');
        const configurations = config.get('configurations');
        // Si no hay configuraciones, mostrar un mensaje de error
        if (configurations.length === 0) {
            vscode.window.showErrorMessage('No se encontraron configuraciones. Por favor, crea una configuración primero.');
            return;
        }
        // Si solo hay una configuración, usarla directamente
        if (configurations.length === 1) {
            await provider.runSummary(configurations[0].name);
            return;
        }
        // Si hay múltiples configuraciones, mostrar un quickpick para seleccionar
        const selected = await vscode.window.showQuickPick(configurations.map(c => c.name), { placeHolder: 'Selecciona una configuración para generar el resumen' });
        if (selected) {
            await provider.runSummary(selected);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map