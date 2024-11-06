// Función para detectar todos los formularios en la página, incluidos los embebidos en iframes
function getAllForms() {
    let forms = Array.from(document.querySelectorAll('form'));
    const iframes = Array.from(document.querySelectorAll('iframe'));

    iframes.forEach(iframe => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const iframeForms = Array.from(iframeDoc.querySelectorAll('form'));
            forms = forms.concat(iframeForms);
        } catch (e) {
            console.warn('No se pudo acceder al contenido del iframe:', e);
        }
    });

    return forms;
}

// Analiza un formulario y devuelve una estructura con sus campos
function analyzeForm(form) {
    const elements = Array.from(form.elements);
    const fields = elements.map(element => {
        return {
            tag: element.tagName.toLowerCase(),
            type: element.type,
            name: element.name,
            id: element.id,
            placeholder: element.placeholder,
            required: element.required,
            options: element.options ? Array.from(element.options).map(opt => opt.value) : null,
            value: element.value
        };
    });
    return { form, fields };
}

// Resalta campos incompletos
function highlightIncompleteFields(fields) {
    fields.forEach(field => {
        if (!field.value) {
            const selector = field.name ? `[name="${field.name}"]` : `#${field.id}`;
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('incomplete-field');
            }
        }
    });
}

// Validación de campos según sus atributos
function validateField(field, value) {
    let isValid = true;
    let error = '';

    if (field.required && !value) {
        isValid = false;
        error = 'Este campo es obligatorio.';
    }

    // Validaciones específicas según el tipo de campo
    // (Agregar aquí validaciones adicionales según sea necesario)

    return { isValid, error };
}

// Maneja la validación de todos los campos
function handleValidation(fields, completedData) {
    const incompleteFields = [];

    fields.forEach(field => {
        const value = completedData[field.name] || '';
        const { isValid, error } = validateField(field, value);
        if (!isValid) {
            incompleteFields.push({ field, error });
            notifyUser(field, error);
        }
    });

    if (incompleteFields.length > 0) {
        highlightIncompleteFields(incompleteFields.map(item => item.field));
    }
}

// Notifica al usuario sobre errores en los campos
function notifyUser(field, message) {
    const element = getElementByField(field);
    if (element) {
        element.setCustomValidity(message);
        element.reportValidity();
    }
}

function getElementByField(field) {
    const selector = field.name ? `[name="${field.name}"]` : `#${field.id}`;
    return document.querySelector(selector);
}

// Limpia notificaciones anteriores
function clearNotifications() {
    const elements = document.querySelectorAll('.incomplete-field');
    elements.forEach(element => {
        element.classList.remove('incomplete-field');
        element.setCustomValidity('');
    });
}

// Autocompleta un formulario con los datos proporcionados por la IA
function autoCompleteForm(formObj, completedData) {
    const { form, fields } = formObj;

    clearNotifications();

    fields.forEach(field => {
        const value = completedData[field.name];
        if (value !== undefined) {
            const element = getElementByField(field);
            if (element) {
                if (field.tag === 'input' || field.tag === 'textarea') {
                    element.value = value;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                } else if (field.tag === 'select') {
                    element.value = value;
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                } else if (field.type === 'checkbox' || field.type === 'radio') {
                    element.checked = value === true || value === 'true';
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }
    });

    // Validar la información
    handleValidation(fields, completedData);

    // Detectar CAPTCHAs
    detectCaptcha(formObj);

    // Manejar errores del formulario
    handleFormErrors(formObj);
}

// Función para detectar CAPTCHAs
function detectCaptcha(formObj) {
    const { form } = formObj;
    const captchaSelectors = [
        '.g-recaptcha',
        'iframe[src*="recaptcha"]',
        'div[id*="captcha"]',
        'input[id*="captcha"]'
    ];
    let captchaDetected = false;

    captchaSelectors.forEach(selector => {
        if (form.querySelector(selector)) {
            captchaDetected = true;
        }
    });

    if (captchaDetected) {
        alert('CAPTCHA detectado. Por favor, complétalo manualmente.');
    }
}

// Maneja errores del formulario
function handleFormErrors(formObj) {
    const { form } = formObj;
    const errorSelectors = ['.error', '.invalid', '.field-error', '.has-error'];
    let errors = [];

    errorSelectors.forEach(selector => {
        const errorElements = form.querySelectorAll(selector);
        errorElements.forEach(errorEl => {
            errors.push(errorEl.textContent.trim());
        });
    });

    if (errors.length > 0) {
        errors.forEach(errorMsg => {
            console.warn(`Error en el formulario: ${errorMsg}`);
        });
    }
}

// Función para guardar datos del usuario
function saveUserData(name, value) {
    // Guardar en chrome.storage.sync
    chrome.storage.sync.get(['userData'], (result) => {
        const userData = result.userData || {};
        userData[name] = value;
        chrome.storage.sync.set({ userData }, () => {
            console.log(`Datos del usuario guardados en chrome.storage.sync: ${name} = ${value}`);
        });
    });

    // Guardar en chrome.storage.local
    chrome.storage.local.get(['userDataLocal'], (result) => {
        const userDataLocal = result.userDataLocal || {};
        userDataLocal[name] = value;
        chrome.storage.local.set({ userDataLocal }, () => {
            console.log(`Datos del usuario guardados en chrome.storage.local: ${name} = ${value}`);
        });
    });
}


// Escucha eventos de entrada para detectar intervención del usuario
document.addEventListener('input', (event) => {
    if (event.target.classList.contains('incomplete-field')) {
        event.target.classList.remove('incomplete-field');
        const name = event.target.name || event.target.id;
        const value = event.target.value;
        if (name) {
            saveUserData(name, value);
        }
    }
});

// Monitorea cambios dinámicos en el DOM y vuelve a detectar formularios
const observer = new MutationObserver((mutations) => {
    let formsChanged = false;
    mutations.forEach(mutation => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
            formsChanged = true;
        }
    });

    if (formsChanged) {
        console.log('Cambios detectados en el DOM. Reanalizando formularios...');
        const allForms = getAllForms();
        chrome.runtime.sendMessage({ type: 'UPDATE_FORMS', forms: allForms.map(analyzeForm) });
    }
});

observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

// Agregar desconexión del observer para evitar fugas de memoria
window.addEventListener('beforeunload', () => {
    observer.disconnect();
});

// Listener para mensajes desde el popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'AUTOCOMPLETE_FORMS') {
        const allForms = getAllForms().map(form => analyzeForm(form));

        // Mostrar una interfaz para que el usuario seleccione los formularios
        // (Esta parte se maneja desde el popup, por lo que aquí simplemente procesamos los formularios)

        // Recolectar datos del usuario almacenados
        chrome.storage.sync.get(['userData'], (result) => {
            const userData = result.userData || {};

            // Solicitar autocompletado a la IA
            chrome.runtime.sendMessage({ type: 'AUTO_COMPLETE', formData: userData }, (response) => {
                if (response && response.completedData) {
                    allForms.forEach(formObj => {
                        autoCompleteForm(formObj, response.completedData);
                        handleFormErrors(formObj);
                    });
                    sendResponse({ status: true });
                } else {
                    sendResponse({ status: false, error: response.error });
                }
            });
        });

        return true; // Respuesta asíncrona
    } else if (request.type === 'GET_FORMS') {
        const forms = getAllForms();
        const formDetails = forms.map((form, index) => {
            return { index, action: form.action || 'Sin acción', method: form.method || 'GET/POST' };
        });
        sendResponse(formDetails);
    }
});
