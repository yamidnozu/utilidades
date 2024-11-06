document.addEventListener('DOMContentLoaded', () => {
    // Manejar guardado de la clave API
    document.getElementById('saveApiKeyButton').addEventListener('click', () => {
        const apiKey = document.getElementById('apiKeyInput').value;
        chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
            alert('Clave API guardada correctamente.');
        });
    });

    // Cargar clave API si está almacenada
    chrome.storage.sync.get(['openaiApiKey'], (result) => {
        if (result.openaiApiKey) {
            document.getElementById('apiKeyInput').value = result.openaiApiKey;
        }
    });

    // Obtener la lista de formularios desde el content script
    const loadForms = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_FORMS' }, (forms) => {
                if (forms && forms.length > 0) {
                    const formList = document.getElementById('formList');
                    formList.innerHTML = '';
                    forms.forEach(form => {
                        const listItem = document.createElement('li');
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.value = form.index;
                        checkbox.checked = true;
                        listItem.appendChild(checkbox);
                        const label = document.createElement('label');
                        label.textContent = `Formulario ${form.index + 1} - Acción: ${form.action}, Método: ${form.method}`;
                        listItem.appendChild(label);
                        formList.appendChild(listItem);
                    });
                } else {
                    document.getElementById('formList').textContent = 'No se encontraron formularios en esta página.';
                }
            });
        });
    };

    // Cargar formularios al iniciar
    loadForms();

    // Botón para volver a cargar los formularios detectados
    document.getElementById('reloadForms').addEventListener('click', loadForms);

    // Manejar clic en el botón de autocompletar
    document.getElementById('startAutofill').addEventListener('click', () => {
        const selectedForms = [];
        const checkboxes = document.querySelectorAll('#formList input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            selectedForms.push(parseInt(checkbox.value));
        });

        if (selectedForms.length === 0) {
            alert('Por favor, selecciona al menos un formulario para autocompletar.');
            return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'AUTOCOMPLETE_FORMS', selectedForms }, (response) => {
                if (response && response.status) {
                    alert('Formulario(s) autocompletado(s) con éxito.');
                } else {
                    alert('Error al autocompletar el/los formulario(s): ' + response.error);
                }
            });
        });
    });
});
