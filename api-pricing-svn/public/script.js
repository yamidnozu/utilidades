// public/script.js

document.addEventListener('DOMContentLoaded', () => {
  const configCardsContainer = document.getElementById('config-cards');
  const endpointForm = document.getElementById('endpoint-form');
  const messageDiv = document.getElementById('message');
  const addConfigBtn = document.getElementById('add-config-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const formTitle = document.getElementById('form-title');
  const responseTypeGroup = document.getElementById('response-type-group');
  const planTypeGroup = document.getElementById('selected-plan-type-group');
  const testAllBtn = document.getElementById('test-all-btn');
  const testResultsDiv = document.getElementById('test-results');
  const clearResultsBtn = document.getElementById('clear-results-btn');
  const selectedPlanTypeSelect = document.getElementById('selectedPlanType');

  // Función para mostrar mensajes
  function showMessage(type, text) {
    messageDiv.classList.remove('success', 'error');
    messageDiv.classList.add(type);
    messageDiv.innerText = text;
    messageDiv.style.display = 'block';
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }

  // Función para crear una tarjeta de configuración
  function createConfigCard(config) {
    const card = document.createElement('div');
    card.classList.add('config-card');
    card.setAttribute('data-id', config.id);

    card.innerHTML = `
      <div class="card-header">
        <h3>ID: ${config.id}</h3>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label>Método:</label>
          <select class="card-method" required>
            <option value="" disabled ${!config.method ? 'selected' : ''}>Selecciona un método</option>
            <option value="GET" ${config.method === 'GET' ? 'selected' : ''}>GET</option>
            <option value="POST" ${config.method === 'POST' ? 'selected' : ''}>POST</option>
            <option value="PUT" ${config.method === 'PUT' ? 'selected' : ''}>PUT</option>
            <option value="DELETE" ${config.method === 'DELETE' ? 'selected' : ''}>DELETE</option>
            <option value="PATCH" ${config.method === 'PATCH' ? 'selected' : ''}>PATCH</option>
          </select>
        </div>

        <div class="form-group">
          <label>Endpoint:</label>
          <input type="text" class="card-path" value="${config.path}" required>
        </div>

        <div class="form-group">
          <label>Usar Datos Mockeados:</label>
          <select class="card-useMock" required>
            <option value="" disabled ${typeof config.useMock === 'undefined' ? 'selected' : ''}>Selecciona una opción</option>
            <option value="true" ${config.useMock ? 'selected' : ''}>Sí</option>
            <option value="false" ${!config.useMock ? 'selected' : ''}>No</option>
          </select>
        </div>

        <div class="form-group card-selected-plan-type-group" style="display: ${config.method.toUpperCase() === 'GET' ? 'block' : 'none'};">
          <label>Seleccionar Tipo de Plan para Responder:</label>
          <select class="card-selectedPlanType" ${config.method.toUpperCase() === 'GET' ? 'required' : ''}>
            <option value="" disabled ${!config.selectedPlanType ? 'selected' : ''}>Selecciona un tipo de plan</option>
            <option value="Plan Esencial" ${config.selectedPlanType === 'Plan Esencial' ? 'selected' : ''}>Plan Esencial</option>
            <option value="Plan Plus" ${config.selectedPlanType === 'Plan Plus' ? 'selected' : ''}>Plan Plus</option>
            <option value="Plan Filex" ${config.selectedPlanType === 'Plan Filex' ? 'selected' : ''}>Plan Filex</option>
            <option value="Tooping Filex" ${config.selectedPlanType === 'Tooping Filex' ? 'selected' : ''}>Tooping Filex</option>
          </select>
        </div>

        <div class="form-group card-response-type-group" style="display: ${config.method.toUpperCase() !== 'GET' ? 'block' : 'none'};">
          <label>Tipo de Respuesta:</label>
          <select class="card-responseType" ${config.method.toUpperCase() !== 'GET' ? 'required' : ''}>
            <option value="" disabled ${!config.responseType ? 'selected' : ''}>Selecciona un tipo de respuesta</option>
            <option value="success" ${config.responseType === 'success' ? 'selected' : ''}>Éxito</option>
            <option value="error" ${config.responseType === 'error' ? 'selected' : ''}>Error</option>
          </select>
        </div>

        <div class="form-group">
          <label>Código de Estado:</label>
          <input type="number" class="card-statusCode" value="${config.statusCode}" min="100" max="599" required>
        </div>

        <div class="form-group">
          <label>Respuesta Mock (JSON):</label>
          <textarea class="card-mockResponse" placeholder='{"key":"value"}'>${JSON.stringify(config.mockResponses, null, 2)}</textarea>
        </div>

        <div class="form-group">
          <label>Error Mock (JSON):</label>
          <textarea class="card-mockError" placeholder='{"errors":[{"message":"Error"}]}' >${JSON.stringify(config.mockError, null, 2)}</textarea>
        </div>

        <div class="form-group">
          <label>URL Externa (si no usa mock):</label>
          <input type="url" class="card-externalUrl" value="${config.externalUrl || ''}" placeholder="https://api.externa.com/endpoint">
        </div>

        <div class="form-group">
          <label>Encabezados (JSON):</label>
          <textarea class="card-headers" placeholder='{"Content-Type":"application/json"}'>${JSON.stringify(config.headers, null, 2)}</textarea>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-success save-btn"><i class="fas fa-save"></i> Guardar</button>
        <button class="btn btn-danger delete-btn"><i class="fas fa-trash-alt"></i> Eliminar</button>
      </div>
    `;

    // Mostrar u ocultar campos adicionales según el método seleccionado
    const methodSelect = card.querySelector('.card-method');
    const selectedPlanTypeGroup = card.querySelector('.card-selected-plan-type-group');
    const responseTypeGroup = card.querySelector('.card-response-type-group');

    methodSelect.addEventListener('change', (e) => {
      const method = e.target.value.toLowerCase();
      if (method === 'get') {
        selectedPlanTypeGroup.style.display = 'block';
        responseTypeGroup.style.display = 'none';
        card.querySelector('.card-selectedPlanType').required = true;
        card.querySelector('.card-responseType').required = false;
      } else {
        selectedPlanTypeGroup.style.display = 'none';
        responseTypeGroup.style.display = 'block';
        card.querySelector('.card-selectedPlanType').required = false;
        card.querySelector('.card-responseType').required = true;
      }
    });

    // Manejar el clic en el botón Guardar dentro de la tarjeta
    const saveBtn = card.querySelector('.save-btn');
    saveBtn.addEventListener('click', async () => {
      const id = config.id;
      const method = card.querySelector('.card-method').value;
      const path = card.querySelector('.card-path').value.trim();
      const useMock = card.querySelector('.card-useMock').value === 'true';
      const responseType = card.querySelector('.card-responseType').value;
      const statusCode = parseInt(card.querySelector('.card-statusCode').value, 10);
      const mockResponses = card.querySelector('.card-mockResponse').value.trim();
      const mockErrorText = card.querySelector('.card-mockError').value.trim();
      const externalUrl = card.querySelector('.card-externalUrl').value.trim();
      const headers = card.querySelector('.card-headers').value.trim();
      const selectedPlanType = card.querySelector('.card-selectedPlanType') ? card.querySelector('.card-selectedPlanType').value.trim() : '';

      // Validar campos obligatorios
      if (!method || !path || typeof useMock === 'undefined' || !statusCode) {
        showMessage('error', 'Por favor, completa todos los campos obligatorios.');
        return;
      }

      // Si el método es GET y usa mock, 'selectedPlanType' es obligatorio
      if (method.toUpperCase() === 'GET' && useMock && !selectedPlanType) {
        showMessage('error', 'Por favor, selecciona un tipo de plan.');
        return;
      }

      // Si el método es POST/PUT/DELETE/PATCH y usa mock, 'responseType' es obligatorio
      if (method.toUpperCase() !== 'GET' && useMock && !responseType) {
        showMessage('error', 'Por favor, selecciona un tipo de respuesta.');
        return;
      }

      // Parsear JSON de mockResponses y mockError
      let parsedMockResponses = {};
      let parsedMockError = {};
      let parsedHeaders = {};

      try {
        if (mockResponses) {
          parsedMockResponses = JSON.parse(mockResponses);
        }
        if (mockErrorText) {
          parsedMockError = JSON.parse(mockErrorText);
        }
        if (headers) {
          parsedHeaders = JSON.parse(headers);
        }
      } catch (error) {
        showMessage('error', `Error al parsear JSON: ${error.message}`);
        return;
      }

      const configData = {
        method,
        path,
        useMock,
        statusCode,
        mockResponses: parsedMockResponses,
        mockError: parsedMockError,
        externalUrl,
        headers: parsedHeaders
      };

      // Si el método es GET y useMock es true, agregar 'selectedPlanType'
      if (method.toUpperCase() === 'GET' && useMock) {
        configData.selectedPlanType = selectedPlanType;
      } else if (method.toUpperCase() === 'GET' && useMock === false) {
        configData.selectedPlanType = null; // No se utiliza en solicitudes reales
      } else {
        configData.responseType = responseType;
      }

      try {
        const response = await fetch(`/api/configurations/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(configData)
        });

        const result = await response.json();
        if (response.ok) {
          showMessage('success', result.message);
          loadConfigurations();
        } else {
          showMessage('error', `Error: ${result.message}`);
        }
      } catch (error) {
        showMessage('error', `Error al guardar la configuración: ${error.message}`);
      }
    });

    // Manejar el clic en el botón Eliminar dentro de la tarjeta
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async () => {
      const id = config.id;
      if (confirm('¿Estás seguro de que deseas eliminar esta configuración?')) {
        try {
          const response = await fetch(`/api/configurations/${id}`, {
            method: 'DELETE'
          });
          const result = await response.json();
          if (response.ok) {
            showMessage('success', result.message);
            loadConfigurations();
          } else {
            showMessage('error', `Error: ${result.message}`);
          }
        } catch (error) {
          showMessage('error', `Error al eliminar la configuración: ${error.message}`);
        }
      }
    });

    return card;
  }

  // Función para cargar todas las configuraciones
  async function loadConfigurations() {
    configCardsContainer.innerHTML = '';
    try {
      const response = await fetch('/api/configurations');
      const configs = await response.json();
      configs.forEach(config => {
        const card = createConfigCard(config);
        configCardsContainer.appendChild(card);
      });
    } catch (error) {
      showMessage('error', `Error al cargar configuraciones: ${error.message}`);
    }
  }

  // Cargar configuraciones al inicio
  loadConfigurations();

  // Mostrar el formulario para agregar una nueva configuración
  addConfigBtn.addEventListener('click', () => {
    endpointForm.reset();
    document.getElementById('config-id').value = '';
    formTitle.textContent = 'Agregar Nueva Configuración';
    cancelEditBtn.style.display = 'none';
    responseTypeGroup.style.display = 'block';
    planTypeGroup.style.display = 'none';
    // Ajustar los atributos required
    document.getElementById('responseType').required = true;
    selectedPlanTypeSelect.required = false;
  });

  // Cancelar la edición
  cancelEditBtn.addEventListener('click', () => {
    endpointForm.reset();
    document.getElementById('config-id').value = '';
    formTitle.textContent = 'Agregar Nueva Configuración';
    cancelEditBtn.style.display = 'none';
    responseTypeGroup.style.display = 'block';
    planTypeGroup.style.display = 'none';
    // Ajustar los atributos required
    document.getElementById('responseType').required = true;
    selectedPlanTypeSelect.required = false;
  });

  // Mostrar u ocultar campos adicionales según el método seleccionado en el formulario
  document.getElementById('method').addEventListener('change', (e) => {
    const method = e.target.value.toLowerCase();
    if (method === 'get') {
      planTypeGroup.style.display = 'block';
      responseTypeGroup.style.display = 'none';
      // Establecer required
      selectedPlanTypeSelect.required = true;
      document.getElementById('responseType').required = false;
    } else {
      planTypeGroup.style.display = 'none';
      responseTypeGroup.style.display = 'block';
      // Establecer required
      selectedPlanTypeSelect.required = false;
      document.getElementById('responseType').required = true;
    }
  });

  // Manejar el envío del formulario para agregar una nueva configuración
  endpointForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('config-id').value;
    const method = document.getElementById('method').value;
    const path = document.getElementById('path').value.trim();
    const useMock = document.getElementById('useMock').value === 'true';
    const responseType = document.getElementById('responseType').value;
    const statusCode = parseInt(document.getElementById('statusCode').value, 10);
    const mockResponses = document.getElementById('mockResponse').value.trim(); // Ahora es un JSON de múltiples respuestas
    const mockErrorText = document.getElementById('mockError').value.trim();
    const externalUrl = document.getElementById('externalUrl').value.trim();
    const headers = document.getElementById('headers').value.trim();
    const selectedPlanType = selectedPlanTypeSelect.value.trim();

    // Validar campos obligatorios
    if (!method || !path || typeof useMock === 'undefined' || !statusCode) {
      showMessage('error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Si el método es GET y usa mock, 'selectedPlanType' es obligatorio
    if (method.toUpperCase() === 'GET' && useMock && !selectedPlanType) {
      showMessage('error', 'Por favor, selecciona un tipo de plan.');
      return;
    }

    // Si el método es POST/PUT/DELETE/PATCH y usa mock, 'responseType' es obligatorio
    if (method.toUpperCase() !== 'GET' && useMock && !responseType) {
      showMessage('error', 'Por favor, selecciona un tipo de respuesta.');
      return;
    }

    // Parsear JSON de mockResponses y mockError
    let parsedMockResponses = {};
    let parsedMockError = {};
    let parsedHeaders = {};

    try {
      if (mockResponses) {
        parsedMockResponses = JSON.parse(mockResponses);
      }
      if (mockErrorText) {
        parsedMockError = JSON.parse(mockErrorText);
      }
      if (headers) {
        parsedHeaders = JSON.parse(headers);
      }
    } catch (error) {
      showMessage('error', `Error al parsear JSON: ${error.message}`);
      return;
    }

    const configData = {
      method,
      path,
      useMock,
      statusCode,
      mockResponses: parsedMockResponses,
      mockError: parsedMockError,
      externalUrl,
      headers: parsedHeaders
    };

    // Si el método es GET y useMock es true, agregar 'selectedPlanType'
    if (method.toUpperCase() === 'GET' && useMock) {
      configData.selectedPlanType = selectedPlanType;
    } else if (method.toUpperCase() === 'GET' && useMock === false) {
      configData.selectedPlanType = null; // No se utiliza en solicitudes reales
    } else {
      configData.responseType = responseType;
    }

    try {
      let response;
      if (id) {
        // Actualizar configuración existente
        response = await fetch(`/api/configurations/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(configData)
        });
      } else {
        // Agregar nueva configuración
        response = await fetch('/api/configurations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(configData)
        });
      }

      const result = await response.json();
      if (response.ok) {
        showMessage('success', result.message);
        endpointForm.reset();
        document.getElementById('config-id').value = '';
        formTitle.textContent = 'Agregar Nueva Configuración';
        cancelEditBtn.style.display = 'none';
        responseTypeGroup.style.display = 'block';
        planTypeGroup.style.display = 'none';
        // Ajustar los atributos required
        document.getElementById('responseType').required = true;
        selectedPlanTypeSelect.required = false;
        loadConfigurations();
      } else {
        showMessage('error', `Error: ${result.message}`);
      }
    } catch (error) {
      showMessage('error', `Error al guardar la configuración: ${error.message}`);
    }
  });

  // Función para realizar pruebas
  async function performTest(config, testType, serviceName, planType) {
    try {
      const body = {
        configId: config.id,
        testType: testType
      };

      if (testType === 'real' && config.useMock === false) {
        // Envío del cuerpo real para la prueba real
        if (serviceName) {
          body.serviceName = serviceName;
        }
        if (planType) {
          body.planType = planType;
        }
      }

      const response = await fetch('/api/test-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, data };
      }
    } catch (error) {
      return { success: false, data: { message: error.message } };
    }
  }

  // Manejar clic en el botón "Test All"
  testAllBtn.addEventListener('click', async () => {
    testResultsDiv.innerHTML = '';
    showMessage('success', 'Iniciando pruebas...');

    try {
      const response = await fetch('/api/configurations');
      const configs = await response.json();

      for (const config of configs) {
        const configDiv = document.createElement('div');
        configDiv.classList.add('test-result');

        const configHeader = document.createElement('h3');
        configHeader.textContent = `ID: ${config.id} | Endpoint: ${config.path}`;
        configDiv.appendChild(configHeader);

        // Prueba Mock Exitoso para cada serviceName o planType
        if (config.method.toLowerCase() === 'post') {
          for (const serviceName in config.mockResponses) {
            const mockSuccessResult = await performTest(config, 'mockSuccess', serviceName);
            const mockSuccessP = document.createElement('p');
            mockSuccessP.innerHTML = `<strong>Mock Success (${serviceName}):</strong> <span class="${mockSuccessResult.success ? 'success-text' : 'error-text'}">${JSON.stringify(mockSuccessResult.data)}</span>`;
            configDiv.appendChild(mockSuccessP);

            // Prueba Mock Error para cada serviceName
            const mockErrorResult = await performTest(config, 'mockError', serviceName);
            const mockErrorP = document.createElement('p');
            mockErrorP.innerHTML = `<strong>Mock Error (${serviceName}):</strong> <span class="${mockErrorResult.success ? 'success-text' : 'error-text'}">${JSON.stringify(mockErrorResult.data)}</span>`;
            configDiv.appendChild(mockErrorP);
          }
        } else if (config.method.toLowerCase() === 'get') {
          const planType = config.selectedPlanType;
          if (planType) {
            const mockSuccessResult = await performTest(config, 'mockSuccess', null, planType);
            const mockSuccessP = document.createElement('p');
            mockSuccessP.innerHTML = `<strong>Mock Success (${planType}):</strong> <span class="${mockSuccessResult.success ? 'success-text' : 'error-text'}">${JSON.stringify(mockSuccessResult.data)}</span>`;
            configDiv.appendChild(mockSuccessP);

            // Prueba Mock Error para el planType
            const mockErrorResult = await performTest(config, 'mockError', null, planType);
            const mockErrorP = document.createElement('p');
            mockErrorP.innerHTML = `<strong>Mock Error (${planType}):</strong> <span class="${mockErrorResult.success ? 'success-text' : 'error-text'}">${JSON.stringify(mockErrorResult.data)}</span>`;
            configDiv.appendChild(mockErrorP);
          }
        }

        // Prueba Real
        if (config.useMock === false && config.externalUrl) {
          if (config.method.toLowerCase() === 'post') {
            for (const serviceName in config.mockResponses) {
              const realResult = await performTest(config, 'real', serviceName);
              const realP = document.createElement('p');
              realP.innerHTML = `<strong>Real Consumption (${serviceName}):</strong> <span class="${realResult.success ? 'success-text' : 'error-text'}">${JSON.stringify(realResult.data)}</span>`;
              configDiv.appendChild(realP);
            }
          } else if (config.method.toLowerCase() === 'get') {
            const planType = config.selectedPlanType;
            if (planType) {
              const realResult = await performTest(config, 'real', null, planType);
              const realP = document.createElement('p');
              realP.innerHTML = `<strong>Real Consumption (${planType}):</strong> <span class="${realResult.success ? 'success-text' : 'error-text'}">${JSON.stringify(realResult.data)}</span>`;
              configDiv.appendChild(realP);
            }
          }
        } else {
          const realP = document.createElement('p');
          realP.innerHTML = `<strong>Real Consumption:</strong> <span class="error-text">No configurado</span>`;
          configDiv.appendChild(realP);
        }

        testResultsDiv.appendChild(configDiv);
      }

      showMessage('success', 'Pruebas completadas.');
    } catch (error) {
      showMessage('error', `Error al realizar las pruebas: ${error.message}`);
    }
  });

  // Manejar clic en el botón "Limpiar Resultados"
  clearResultsBtn.addEventListener('click', () => {
    testResultsDiv.innerHTML = '';
  });
});
