const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const puerto = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const rutaDb = path.join(__dirname, 'db.json');

async function leerDb() {
  try {
    const datos = await fs.readFile(rutaDb, 'utf8');
    return JSON.parse(datos);
  } catch (error) {
    console.error('Error leyendo db.json:', error);
    return { categorias: [], configuraciones: {}, customerPlans: [], paymentMethods: [] };
  }
}

async function escribirDb(datos) {
  try {
    await fs.writeFile(rutaDb, JSON.stringify(datos, null, 2));
  } catch (error) {
    console.error('Error escribiendo db.json:', error);
  }
}

async function simularErrores(req, res, next) {
  try {
    const db = await leerDb();
    const ruta = req.path;
    const configuracion = db.configuraciones[ruta] || 'success';

    if (configuracion === 'error') {
      return res.status(500).json({
        errors: [{
          type: "Error",
          code: "504",
          reason: "Algo salió mal",
          message: "No fue posible cargar la información. Intenta de nuevo",
          domain: ruta
        }]
      });
    }

    if (configuracion === 'empty' && ruta === '/api/v1/ch-ms-category-management-pricing/categories') {
      return res.status(404).json({
        errors: [{
          type: "Error",
          code: "CTB201",
          reason: "Lo sentimos",
          message: "Aun no tienes Categorias. Crea las categorias que deseas administrar.",
          domain: ruta
        }]
      });
    }

    next();
  } catch (error) {
    console.error('Error en simularErrores middleware:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "Error interno del servidor.",
        domain: req.path
      }]
    });
  }
}

app.get('/x', async (req, res) => {
  res.json({ message: 'Hola' });
});

app.use(simularErrores);

// Rutas existentes...
app.get('/x', async (req, res) => {
  res.json({ message: 'Hola' });
});

// Crear Categoría
app.post('/api/v1/ch-ms-category-management-pricing/create-category', async (req, res) => {
  try {
    const db = await leerDb();
    const { name, description, optionList } = req.body.data.attributes.param.create;

    const nuevaCategoria = {
      categoryId: db.categorias.length + 1,
      categoryCode: `CAT${String(db.categorias.length + 1).padStart(3, '0')}`,
      categoryName: name,
      categoryDescription: description,
      categoryOptionsCount: optionList.length,
      categoryAssignedPlan: null,
      optionsList: optionList.map((opcion, index) => ({
        optionId: db.categorias.reduce((acc, cat) => acc + cat.optionsList.length, 0) + index + 1,
        optionCode: opcion.optionCode,
        optionName: opcion.description
      }))
    };

    db.categorias.push(nuevaCategoria);
    await escribirDb(db);

    res.json({
      meta: { code: "200", message: "Transacción Exitosa" },
      transactionRequest: { request: req.body },
      transactionResponse: {
        response: {
          type: "PRICINGCREATECATEGORYRS",
          id: req.body.data.id,
          attributes: {
            timestamp: new Date().toISOString(),
            appId: "MACD",
            appModule: "Pricing - Categories",
            result: nuevaCategoria
          }
        }
      }
    });
  } catch (error) {
    console.error('Error en create-category:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible crear la categoría.",
        domain: "/api/v1/ch-ms-category-management-pricing/create-category"
      }]
    });
  }
});

// Listar Categorías
app.get('/api/v1/ch-ms-category-management-pricing/categories', async (req, res) => {
  try {
    const db = await leerDb();
    const { optionName, categoryName, pageSize = 10, pageNumber = 1, sortBy = 'categoryName' } = req.query;

    const pageSizeInt = parseInt(pageSize);
    const pageNumberInt = parseInt(pageNumber);

    let categoriasFiltradas = db.categorias;

    if (categoryName) {
      categoriasFiltradas = categoriasFiltradas.filter(cat =>
        cat.categoryName.toLowerCase().includes(categoryName.toLowerCase())
      );
    }

    if (optionName) {
      categoriasFiltradas = categoriasFiltradas.filter(cat =>
        cat.optionsList.some(opcion =>
          opcion.optionName.toLowerCase().includes(optionName.toLowerCase())
        )
      );
    }

    const totalRegistros = categoriasFiltradas.length;
    const indiceInicio = (pageNumberInt - 1) * pageSizeInt;
    const indiceFin = indiceInicio + pageSizeInt;

    categoriasFiltradas.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

    const categoriasPaginadas = categoriasFiltradas.slice(indiceInicio, indiceFin);

    if (categoriasPaginadas.length === 0) {
      return res.status(404).json({
        errors: [{
          type: "Error",
          code: "CTB202",
          reason: "Lo sentimos",
          message: "Tu búsqueda no obtuvo resultados. Prueba con otra información.",
          domain: "/api/v1/ch-ms-category-management-pricing/categories"
        }]
      });
    }

    res.json({
      meta: { code: "200", message: "Transacción Exitosa" },
      transactionRequest: { request: req.query },
      transactionResponse: {
        response: {
          type: "PRICINGRETRIEVECATEGORIESRS",
          id: null,
          attributes: {
            timestamp: new Date().toISOString(),
            appId: "MACD",
            appModule: "Pricing - Categories",
            result: {
              pagination: {
                sortBy,
                pageNumber: pageNumberInt,
                pageSize: pageSizeInt,
                totalRecords: totalRegistros
              },
              categoryList: categoriasPaginadas
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error en listar-categorias:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible listar las categorías.",
        domain: "/api/v1/ch-ms-category-management-pricing/categories"
      }]
    });
  }
});

// Validar Nombre de Categoría
app.get('/api/v1/ch-ms-category-management-pricing/validate-category-name', async (req, res) => {
  try {
    const db = await leerDb();
    const { categoryName } = req.query;

    const existe = db.categorias.some(cat =>
      cat.categoryName.toLowerCase() === categoryName.toLowerCase()
    );

    if (existe) {
      return res.status(400).json({
        errors: [{
          type: "Error",
          code: "CTB203",
          reason: "Lo sentimos",
          message: "El nombre de la categoría ya se encuentra en uso. Elige otro.",
          domain: "/api/v1/ch-ms-category-management-pricing/validate-category-name"
        }]
      });
    }

    res.json({
      meta: { code: "200", message: "Transacción Exitosa" },
      transactionRequest: { request: { categoryName } },
      transactionResponse: {
        response: {
          type: "PRICINGVALIDATECATEGORYNAMERS",
          id: null,
          attributes: {
            timestamp: new Date().toISOString(),
            appId: "MACD",
            appModule: "Pricing - Categories",
            result: {
              valid: true,
              description: "Nombre de categoría disponible"
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error en validate-category-name:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible validar el nombre de la categoría.",
        domain: "/api/v1/ch-ms-category-management-pricing/validate-category-name"
      }]
    });
  }
});

// Obtener Opciones
app.get('/api/v1/ch-ms-category-management-pricing/options', async (req, res) => {
  try {
    const db = await leerDb();
    const { channel } = req.query;

    const opciones = [
      {
        id: 0,
        optionCode: "3105",
        state: "Active",
        active: true,
        description: "Actualizacion de solicitudes de aprobaciones de convenios Libranzas",
        inUse: false
      },
      {
        id: 0,
        optionCode: "0705",
        state: "Active",
        active: true,
        description: "Administrar productos de terceros",
        inUse: false
      },
      {
        id: 0,
        optionCode: "6100",
        state: "Active",
        active: true,
        description: "Autenticación ANF",
        inUse: false
      },
      {
        id: 0,
        optionCode: "385",
        state: "Active",
        active: true,
        description: "Autenticación transitoria Sucurtal Virtual Negocios",
        inUse: false
      },
      {
        id: 0,
        optionCode: "359",
        state: "Active",
        active: true,
        description: "Balances SVN",
        inUse: false
      },
      {
        id: 0,
        optionCode: "6122",
        state: "Active",
        active: true,
        description: "Cargar archivos de instruccion y soportes",
        inUse: false
      },
      {
        id: 0,
        optionCode: "8005",
        state: "Active",
        active: true,
        description: "Consulta Estado Registro",
        inUse: false
      },
      {
        id: 0,
        optionCode: "0327",
        state: "Active",
        active: true,
        description: "Consulta Listado Inversion Virtual",
        inUse: false
      },
      {
        id: 13,
        optionCode: "4112",
        state: "Active",
        active: true,
        description: "Consulta cuentas y saldos cliente de leasing",
        inUse: true
      },
      {
        id: 0,
        optionCode: "3100",
        state: "Active",
        active: true,
        description: "Consulta de Convenios por NIT",
        inUse: false
      }
    ];

    res.json({
      meta: { code: "200", message: "Transacción Exitosa" },
      transactionRequest: { request: { channel } },
      transactionResponse: {
        response: {
          type: "PRICINGRETRIEVEOPTIONSRS",
          id: null,
          attributes: {
            timestamp: new Date().toISOString(),
            appId: "MACD",
            appModule: "Pricing - Options",
            result: {
              optionList: opciones
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error en options:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible obtener las opciones.",
        domain: "/api/v1/ch-ms-category-management-pricing/options"
      }]
    });
  }
});

// Ruta del Dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Obtener Configuraciones
app.get('/api/settings', async (req, res) => {
  try {
    const db = await leerDb();
    res.json(db.configuraciones);
  } catch (error) {
    console.error('Error en get /api/settings:', error);
    res.status(500).json({ message: 'Error al obtener configuraciones' });
  }
});

// Actualizar Configuraciones
app.post('/api/settings', async (req, res) => {
  try {
    const db = await leerDb();
    db.configuraciones = req.body;
    await escribirDb(db);
    res.json({ message: 'Configuraciones actualizadas exitosamente' });
  } catch (error) {
    console.error('Error en post /api/settings:', error);
    res.status(500).json({ message: 'Error al actualizar configuraciones' });
  }
});

// Nuevas Rutas según Swagger

// Crear un nuevo plan para un cliente
app.post('/api/v1/ch-ms-relation-management-pricing/customer-plan', async (req, res) => {
  try {
    const db = await leerDb();
    const {
      planId,
      chargePercentage,
      state,
      paymentMethod
    } = req.body;

    const newPlan = {
      planId,
      chargePercentage,
      state,
      paymentMethod,
      documentType: req.headers['document-type'],
      documentNumber: req.headers['document-number'],
      purchaseDate: new Date().toISOString().split('T')[0],
      activationDate: new Date().toISOString().split('T')[0]
    };

    db.customerPlans.push(newPlan);
    await escribirDb(db);

    res.json({
      planId: newPlan.planId,
      documentType: newPlan.documentType,
      documentNumber: newPlan.documentNumber,
      purchaseDate: newPlan.purchaseDate,
      activationDate: newPlan.activationDate,
      chargePercentage: newPlan.chargePercentage,
      state: newPlan.state
    });
  } catch (error) {
    console.error('Error en crear customer-plan:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible crear el plan de cliente.",
        domain: "/api/v1/ch-ms-relation-management-pricing/customer-plan"
      }]
    });
  }
});

// Cambiar el plan de un cliente
app.put('/api/v1/ch-ms-relation-management-pricing/customer-plan-', async (req, res) => {
  try {
    const db = await leerDb();
    const { currentPlanId, targetPlanId, paymentMethod } = req.body;

    const currentPlan = db.customerPlans.find(plan =>
      plan.planId === currentPlanId &&
      plan.documentType === req.headers['document-type'] &&
      plan.documentNumber === req.headers['document-number']
    );

    if (!currentPlan) {
      return res.status(404).json({
        errors: [{
          type: "Error",
          code: "CTB301",
          reason: "No encontrado",
          message: "Plan actual no encontrado.",
          domain: "/api/v1/ch-ms-relation-management-pricing/customer-plan-"
        }]
      });
    }

    currentPlan.planId = targetPlanId;
    currentPlan.paymentMethod = paymentMethod;

    await escribirDb(db);

    res.json({
      targetPlanId: targetPlanId,
      targetPlanName: `Plan ${targetPlanId}`,
      activationDate: new Date().toISOString().split('T')[0],
      transactionId: uuidv4()
    });
  } catch (error) {
    console.error('Error en cambiar customer-plan:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible cambiar el plan de cliente.",
        domain: "/api/v1/ch-ms-relation-management-pricing/customer-plan-"
      }]
    });
  }
});

// Cambiar el porcentaje de cobro del plan de un cliente existente
app.post('/api/v1/ch-ms-relation-management-pricing/customer-plan-by-document', async (req, res) => {
  try {
    const db = await leerDb();
    const { pagination, filter } = req.body;

    const { serviceType, planId, state } = filter;

    const plan = db.customerPlans.find(p =>
      p.planId === planId &&
      p.state.toLowerCase() === state.toLowerCase() &&
      p.documentType // Agregar más filtros si es necesario
    );

    if (!plan) {
      return res.status(404).json({
        errors: [{
          type: "Error",
          code: "CTB304",
          reason: "No encontrado",
          message: "Plan del cliente no encontrado.",
          domain: "/api/v1/ch-ms-relation-management-pricing/customer-plan-by-document"
        }]
      });
    }

    // Actualizar chargePercentage o realizar la acción requerida
    // Aquí asumimos que se cambia el chargePercentage
    plan.chargePercentage += 0.05; // Ejemplo de cambio

    await escribirDb(db);

    res.json({
      meta: { code: "200", message: "Porcentaje de cobro actualizado con éxito" },
      data: plan
    });
  } catch (error) {
    console.error('Error en customer-plan-by-document:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible actualizar el porcentaje de cobro.",
        domain: "/api/v1/ch-ms-relation-management-pricing/customer-plan-by-document"
      }]
    });
  }
});

// Cambiar el porcentaje de cobro del plan de un cliente existente
app.patch('/api/v1/ch-ms-relation-management-pricing/macd/charge-percentage', async (req, res) => {
  try {
    const db = await leerDb();
    const { documentType, documentNumber, currentPlanId, chargePercentage } = req.body;

    const plan = db.customerPlans.find(p =>
      p.documentType === documentType &&
      p.documentNumber === documentNumber &&
      p.planId === currentPlanId
    );

    if (!plan) {
      return res.status(404).json({
        errors: [{
          type: "Error",
          code: "CTB302",
          reason: "No encontrado",
          message: "Plan del cliente no encontrado.",
          domain: "/api/v1/ch-ms-relation-management-pricing/macd/charge-percentage"
        }]
      });
    }

    const previousChargePercent = plan.chargePercentage;
    plan.chargePercentage = chargePercentage;

    await escribirDb(db);

    res.json({
      meta: {
        code: "200",
        message: "Porcentaje de cobro actualizado con éxito"
      },
      data: {
        previousChargePercent: `${previousChargePercent * 100}%`,
        currentChargePercent: `${chargePercentage * 100}%`
      }
    });
  } catch (error) {
    console.error('Error en charge-percentage:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible actualizar el porcentaje de cobro.",
        domain: "/api/v1/ch-ms-relation-management-pricing/macd/charge-percentage"
      }]
    });
  }
});

// Obtener todos los planes de los clientes
app.get('/api/v1/ch-ms-relation-management-pricing/macd/retrieve-customer-plan', async (req, res) => {
  try {
    console.log('Ruta /retrieve-customer-plan accedida');
    const db = await leerDb();
    const customerPlans = db.customerPlans;
    const services = db.services;
    const {
      pageSize = 10,
      lastId,
      planId,
      documentType,
      documentNumber,
      typeService
    } = req.query;

    // Vincular cada customerPlan con su servicio correspondiente
    const customerPlansWithService = customerPlans.map(plan => {
      const service = services.find(s => s.serviceId === plan.planId);
      return {
        ...plan,
        service
      };
    });

    let filteredPlans = customerPlansWithService;

    // Aplicar filtros
    console.log(`Filtrado por planId=${typeService}, total: ${filteredPlans.length}`);
    if (planId) {
      filteredPlans = filteredPlans.filter(plan => plan.planId === parseInt(planId));
    }
    

    if (documentType) {
      filteredPlans = filteredPlans.filter(plan => plan.documentType === documentType);
    }

    if (documentNumber) {
      filteredPlans = filteredPlans.filter(plan => plan.documentNumber === documentNumber);
    }

    if (typeService) {
      filteredPlans = filteredPlans.filter(plan =>{
        console.log('Plan:', plan);
        return plan.service && plan.service.serviceTypeName.toLowerCase() === typeService.toLowerCase()
      }
        
      );
    }
    

    const totalRecords = filteredPlans.length;
    const pageSizeInt = parseInt(pageSize);
    const totalPages = Math.ceil(totalRecords / pageSizeInt);
    const currentPage = lastId
      ? Math.floor(
          filteredPlans.findIndex(plan => plan.planId === parseInt(lastId)) / pageSizeInt
        ) + 1
      : 1;

    const paginatedPlans = filteredPlans.slice(
      (currentPage - 1) * pageSizeInt,
      currentPage * pageSizeInt
    );

    res.json({
      meta: {
        code: "200",
        message: "Operación exitosa"
      },
      pagination: {
        lastIndex:
          paginatedPlans.length > 0
            ? paginatedPlans[paginatedPlans.length - 1].planId.toString()
            : "0",
        pageSize: pageSizeInt,
        totalPages: totalPages,
        totalRecords: totalRecords
      },
      data: paginatedPlans.map(plan => ({
        customerInformation: {
          documentType: plan.documentType,
          documentNumber: plan.documentNumber,
          customerName: "Nombre del Cliente" // Puedes reemplazarlo con datos reales si los tienes
        },
        service: [
          {
            id: plan.planId,
            idType: 1,
            type: plan.service ? plan.service.serviceTypeName : "Desconocido",
            name: plan.service ? plan.service.serviceName : `Plan ${plan.planId}`,
            purchaseDate: plan.purchaseDate,
            activationDate: plan.activationDate,
            minimumStay: plan.service ? plan.service.minimiunStay : null,
            chargePercentage: plan.chargePercentage,
            fee: plan.service ? plan.service.rateValue : null,
            state: plan.state
          }
        ]
      }))
    });
  } catch (error) {
    console.error('Error en retrieve-customer-plan:', error);
    res.status(500).json({
      errors: [
        {
          type: "Error",
          code: "500",
          reason: "Internal Server Error",
          message: "No fue posible recuperar los planes de clientes.",
          domain: "/api/v1/ch-ms-relation-management-pricing/macd/retrieve-customer-plan"
        }
      ]
    });
  }
});


// ------------------ Nuevos Endpoints para Métodos de Pago ------------------

// Obtener Método de Pago de un Usuario
app.post('/api/v1/ch-ms-payment-methods-pricing/macd/get-payment-method', async (req, res) => {
  try {
    const { documentType, documentNumber } = req.body;

    if (!documentType || !documentNumber) {
      return res.status(400).json({
        errors: [{
          type: "Error",
          code: "CTB001",
          reason: "Solicitud Incorrecta",
          message: "Faltan datos requeridos: documentType y documentNumber.",
          domain: "/api/v1/ch-ms-payment-methods-pricing/macd/get-payment-method"
        }]
      });
    }

    const db = await leerDb();
    const paymentEntry = db.paymentMethods.find(pm =>
      pm.documentType === documentType &&
      pm.documentNumber === documentNumber
    );

    if (!paymentEntry) {
      return res.status(404).json({
        errors: [{
          type: "Error",
          code: "CTB007",
          reason: "No encontrado",
          message: "El usuario no tiene un método de pago registrado.",
          domain: "/api/v1/ch-ms-payment-methods-pricing/macd/get-payment-method"
        }]
      });
    }

    res.json({
      meta: {
        code: "200",
        message: "Se ha obtenido el método de pago correctamente."
      },
      paymentMethod: {
        number: paymentEntry.paymentMethod.number,
        methodClass: paymentEntry.paymentMethod.methodClass,
        type: paymentEntry.paymentMethod.type
      }
    });
  } catch (error) {
    console.error('Error en get-payment-method:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible obtener el método de pago.",
        domain: "/api/v1/ch-ms-payment-methods-pricing/macd/get-payment-method"
      }]
    });
  }
});

// Matricular o Actualizar Método de Pago de un Usuario
app.post('/api/v1/ch-ms-payment-methods-pricing/macd/matriculate-payment-method', async (req, res) => {
  try {
    const { paymentMethod, customer } = req.body;

    if (!paymentMethod || !customer || !customer.documentType || !customer.documentNumber) {
      return res.status(400).json({
        errors: [{
          type: "Error",
          code: "CTB001",
          reason: "Solicitud Incorrecta",
          message: "Faltan datos requeridos en paymentMethod o customer.",
          domain: "/api/v1/ch-ms-payment-methods-pricing/macd/matriculate-payment-method"
        }]
      });
    }

    const { methodClass, number, type } = paymentMethod;
    const { documentType, documentNumber } = customer;

    // Validar methodClass
    const validMethodClasses = ["CUENTA_DE_AHORRO", "CUENTA_CORRIENTE"];
    if (!validMethodClasses.includes(methodClass)) {
      return res.status(400).json({
        errors: [{
          type: "Error",
          code: "CTB008",
          reason: "Validación Fallida",
          message: "La cuenta especificada no cumple los requisitos para ser marcada como cuenta de cobro.",
          domain: "/api/v1/ch-ms-payment-methods-pricing/macd/matriculate-payment-method"
        }]
      });
    }

    const db = await leerDb();
    const paymentEntryIndex = db.paymentMethods.findIndex(pm =>
      pm.documentType === documentType &&
      pm.documentNumber === documentNumber &&
      pm.paymentMethod.number === number
    );

    if (paymentEntryIndex !== -1) {
      // Verificar si el usuario es titular de la cuenta
      const existingPaymentMethod = db.paymentMethods[paymentEntryIndex].paymentMethod;
      if (existingPaymentMethod.number !== number) {
        return res.status(400).json({
          errors: [{
            type: "Error",
            code: "CTB007",
            reason: "Lo sentimos",
            message: "El usuario no es titular de la cuenta especificada.",
            domain: "/api/v1/ch-ms-payment-methods-pricing/macd/matriculate-payment-method"
          }]
        });
      }

      // Actualizar método de pago
      db.paymentMethods[paymentEntryIndex].paymentMethod = {
        methodClass,
        number,
        type
      };

      await escribirDb(db);

      res.json({
        matriculationSuccess: true
      });
    } else {
      // Matricular nuevo método de pago
      db.paymentMethods.push({
        documentType,
        documentNumber,
        paymentMethod: {
          methodClass,
          number,
          type
        }
      });

      await escribirDb(db);

      res.json({
        matriculationSuccess: true
      });
    }
  } catch (error) {
    console.error('Error en matriculate-payment-method:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible matricular o actualizar el método de pago.",
        domain: "/api/v1/ch-ms-payment-methods-pricing/macd/matriculate-payment-method"
      }]
    });
  }
});

// ------------------ Fin Nuevos Endpoints para Métodos de Pago ------------------

// ------------------ Nuevas Rutas desde Mockoon ------------------

// Listar Planes
app.post('/api/v1/ch-ms-service-management-pricing/list-plans', async (req, res) => {
  try {
    const db = await leerDb();
    const configuracion = db.configuraciones['/api/v1/ch-ms-service-management-pricing/list-plans'] || 'success';

    if (configuracion === 'error') {
      return res.status(409).json({
        errors: [{
          type: "Error",
          code: "CTT409",
          reason: "Algo salió mal",
          message: "No fue posible cargar la información. Intenta de nuevo.",
          domain: "/api/v1/ch-ms-service-management-pricing/list-plans"
        }]
      });
    }

    if (configuracion === 'empty') {
      return res.status(404).json({
        errors: [{
          type: "Error",
          code: "CTT404",
          reason: "Lo sentimos",
          message: "Aun no tienes Plan/Topping. Crea los Planes/Toppings que deseas administrar.",
          domain: "/api/v1/ch-ms-service-management-pricing/list-plans"
        }]
      });
    }

    // Obtener los filtros de la solicitud
    const { data } = req.body;
    console.log('Data:', data);
    const filters = data.attributes.param.retrieve.filter || {};
    let planes = db.services;

    // Aplicar filtros
    if (filters.serviceName) {
      planes = planes.filter(plan =>
        plan.serviceName.toLowerCase().includes(filters.serviceName.toLowerCase())
      );
    }

    if (filters.serviceType) {
      planes = planes.filter(plan =>
        plan.serviceTypeName.toLowerCase() === filters.serviceType.toLowerCase()
      );
    }

    if (filters.creationDate) {
      planes = planes.filter(plan =>
        plan.creationDate === filters.creationDate
      );
    }

    if (planes.length === 0) {
      return res.status(404).json({
        errors: [{
          type: "Error",
          code: "CTT404",
          reason: "Lo sentimos",
          message: "Tu búsqueda no obtuvo resultados. Prueba con otra información.",
          domain: "/api/v1/ch-ms-service-management-pricing/list-plans"
        }]
      });
    }

    res.json({
      data: {
        type: "RETRIEVESERVICERS",
        id: "list-plan-message",
        attributes: {
          companyName: "Company-Name",
          companyId: "1",
          docType: "NIT",
          timestamp: new Date().toISOString(),
          userId: null,
          ip: "",
          appId: "1",
          appModule: "pricing",
          data: {
            retrieve: planes
          }
        }
      }
    });
  } catch (error) {
    console.error('Error en list-plans:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible obtener la lista de planes.",
        domain: "/api/v1/ch-ms-service-management-pricing/list-plans"
      }]
    });
  }
});

// Obtener Categorías
app.get('/api/v1/ch-ms-service-management-pricing/retrieve-categories', async (req, res) => {
  try {
    const db = await leerDb();
    res.json({
      data: {
        type: "RETRIEVECATEGORYRS",
        id: "list-categories-message",
        attributes: {
          companyName: "companyName",
          companyId: "1",
          docType: "NIT",
          timestamp: new Date().toISOString(),
          userId: "user123",
          ip: "10.10.40",
          appId: "1",
          appModule: "pricing",
          data: {
            retrieve: db.categorias.map(cat => ({
              categoryId: cat.categoryId,
              categoryName: cat.categoryCode,
              categoryDescription: cat.categoryDescription,
              categoryNamePublic: cat.categoryName
            }))
          }
        }
      }
    });
  } catch (error) {
    console.error('Error en retrieve-categories:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible obtener las categorías.",
        domain: "/api/v1/ch-ms-service-management-pricing/retrieve-categories"
      }]
    });
  }
});

// Actualizar Plan
app.get('/api/v1/ch-ms-service-management-pricing/update-plan', async (req, res) => {
  try {
    const db = await leerDb();
    const configuracion = db.configuraciones['/api/v1/ch-ms-service-management-pricing/update-plan'] || 'success';

    if (configuracion === 'error') {
      return res.status(409).json({
        errors: [{
          type: "Error",
          code: "CTT409",
          reason: "Algo salió mal",
          message: "No fue posible cargar la información. Intenta de nuevo.",
          domain: "/api/v1/ch-ms-service-management-pricing/update-plan"
        }]
      });
    }

    // Aquí puedes actualizar el plan en db.json según sea necesario

    res.json({
      data: {
        type: "UPDATESERVICERS",
        id: "update-service",
        attributes: {
          companyName: "companyName",
          companyId: "1",
          docType: "NIT",
          timestamp: new Date().toISOString(),
          userId: "user123",
          ip: "10.10.40",
          appId: "1",
          appModule: "pricing",
          data: {
            update: {
              // Datos del plan actualizado
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error en update-plan:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible actualizar el plan.",
        domain: "/api/v1/ch-ms-service-management-pricing/update-plan"
      }]
    });
  }
});

// Validar Nombre de Servicio
app.get('/api/v1/ch-ms-service-management-pricing/validate-service-name', async (req, res) => {
  try {
    const db = await leerDb();
    const { 'service-name': serviceName } = req.query;

    const existe = db.customerPlans.some(plan =>
      plan.planName && plan.planName.toLowerCase() === serviceName.toLowerCase()
    );

    if (existe) {
      return res.status(409).json({
        errors: [{
          type: "Error",
          code: "CTB403",
          reason: "Lo sentimos",
          message: "El nombre del Plan/Topping ya se encuentra en uso. Elige otro.",
          domain: "/api/v1/ch-ms-service-management-pricing/validate-service-name"
        }]
      });
    }

    res.json({
      response: {
        type: "VALIDATESERVICENAMERS",
        id: "validate-service-name-message",
        attributes: {
          companyName: "companyName",
          companyId: "1",
          docType: "NIT",
          timestamp: new Date().toISOString(),
          userId: "user123",
          ip: "10.10.40",
          appId: "1",
          appModule: "pricing",
          data: {
            validateServiceName: "Service name is available"
          }
        }
      }
    });
  } catch (error) {
    console.error('Error en validate-service-name:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible validar el nombre del servicio.",
        domain: "/api/v1/ch-ms-service-management-pricing/validate-service-name"
      }]
    });
  }
});

// Crear Servicio
app.post('/api/v1/ch-ms-service-management-pricing/create-service', async (req, res) => {
  try {
    const db = await leerDb();
    const configuracion = db.configuraciones['/api/v1/ch-ms-service-management-pricing/create-service'] || 'success';

    if (configuracion === 'error') {
      return res.status(409).json({
        errors: [{
          type: "Error",
          code: "CTT409",
          reason: "Lo sentimos",
          message: "No es posible continuar con la transacción en este momento. Por favor intente nuevamente o contáctenos por alguno de nuestros canales de atención.",
          domain: "/api/v1/ch-ms-service-management-pricing/create-service"
        }]
      });
    }

    // Aquí puedes agregar el nuevo servicio a db.json

    res.json({
      data: {
        type: "CREATESERVICERS",
        id: "save-service",
        attributes: {
          companyName: "companyName",
          companyId: "1",
          docType: "NIT",
          timestamp: new Date().toISOString(),
          userId: "user123",
          ip: "10.10.40",
          appId: "1",
          appModule: "pricing",
          data: {
            create: {
              // Datos del servicio creado
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error en create-service:', error);
    res.status(500).json({
      errors: [{
        type: "Error",
        code: "500",
        reason: "Internal Server Error",
        message: "No fue posible crear el servicio.",
        domain: "/api/v1/ch-ms-service-management-pricing/create-service"
      }]
    });
  }
});

// ------------------ Fin Nuevas Rutas desde Mockoon ------------------

// Iniciar el Servidor
app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
