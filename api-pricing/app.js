const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

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
    return { categorias: [], configuraciones: {} };
  }
}

async function escribirDb(datos) {
  await fs.writeFile(rutaDb, JSON.stringify(datos, null, 2));
}

async function simularErrores(req, res, next) {
  const db = await leerDb();
  const { path } = req;
  const configuracion = db.configuraciones[path] || 'success';

  if (configuracion === 'error') {
    return res.status(500).json({
      errors: [{
        type: "Error",
        code: "SIM500",
        reason: "Error simulado",
        message: "Se ha simulado un error en este endpoint.",
        domain: path
      }]
    });
  }

  if (configuracion === 'empty' && path === '/api/v1/ch-ms-category-management-pricing/categories') {
    return res.status(404).json({
      errors: [{
        type: "Error",
        code: "CTB201",
        reason: "Lo sentimos",
        message: "Aun no tienes Categorias. Crea las categorias que deseas administrar.",
        domain: path
      }]
    });
  }

  next();
}

app.use(simularErrores);

app.post('/api/v1/ch-ms-category-management-pricing/create-category', async (req, res) => {
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
});

app.get('/api/v1/ch-ms-category-management-pricing/categories', async (req, res) => {
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
});

app.get('/api/v1/ch-ms-category-management-pricing/validate-category-name', async (req, res) => {
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
});

app.get('/api/v1/ch-ms-category-management-pricing/options', async (req, res) => {
  const db = await leerDb();
  const { channel } = req.query;

  const opciones = [
    // Aquí puedes agregar las opciones desde la base de datos o de una fuente de datos estática
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
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/settings', async (req, res) => {
  const db = await leerDb();
  res.json(db.configuraciones);
});

app.post('/api/settings', async (req, res) => {
  const db = await leerDb();
  db.configuraciones = req.body;
  await escribirDb(db);
  res.json({ message: 'Configuraciones actualizadas exitosamente' });
});
app.use(cors({
  origin: 'http://localhost:4200' // Habilitar CORS para tu aplicación Angular
}));
app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
