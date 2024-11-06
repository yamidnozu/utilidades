
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'AUTO_COMPLETE' && request.formData) {
        getAICompletion(request.formData)
            .then(completedData => {
                sendResponse({ completedData });
            })
            .catch(error => {
                console.error('Error al obtener datos de IA:', error);
                sendResponse({ error: 'Error al obtener datos de IA.' });
            });
        return true; // Indica que la respuesta será asíncrona
    }
});

// Función para obtener la clave API almacenada
function getApiKey() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['openaiApiKey'], (result) => {
            resolve(result.openaiApiKey);
        });
    });
}

// Función para comunicarse con la API de OpenAI
async function getAICompletion(formData) {
    const apiKey = await getApiKey();
    if (!apiKey) {
        throw new Error('La clave de la API no está definida. Por favor, ingrésala en las opciones de la extensión.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Eres un asistente de IA que ayuda a completar formularios web. Dado el siguiente formulario representado en JSON, completa los valores faltantes de manera inteligente y devuelve únicamente un objeto JSON con los campos completados. No incluyas ninguna explicación adicional.'
                },
                {
                    role: 'user',
                    content: generatePrompt(formData)
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    return parseAIResponse(aiResponse);
}

// Genera el prompt para la IA basado en los datos del formulario
function generatePrompt(formData) {
    return `Formulario:
${JSON.stringify(formData, null, 2)}

Datos completados (en JSON):`;
}

// Analiza la respuesta de la IA y la convierte en un objeto
function parseAIResponse(text) {
    try {
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');
        const jsonString = text.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('Error al parsear la respuesta de la IA:', e);
        return {};
    }
}
