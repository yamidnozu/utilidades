import * as vscode from 'vscode';
import { SummaryViewProvider } from './SummaryViewProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating extension');
    const provider = new SummaryViewProvider(context.extensionUri);
    console.log('Provider created');

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(SummaryViewProvider.viewType, provider)
    );
    console.log('Provider registered');

    let disposable = vscode.commands.registerCommand('summary1.runSummary', async () => {
        // Obtener las configuraciones
        const config = vscode.workspace.getConfiguration('summary1');
        const configurations = config.get('configurations') as Array<{ name: string }>;

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
        const selected = await vscode.window.showQuickPick(
            configurations.map(c => c.name),
            { placeHolder: 'Selecciona una configuración para generar el resumen' }
        );

        if (selected) {
            await provider.runSummary(selected);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}