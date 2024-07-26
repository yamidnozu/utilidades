const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const puerto = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Operaciones de base de datos
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

// Middleware para simular errores según la configuración
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

// Endpoints del API

// Crear categoría
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

// Listar y filtrar categorías
app.get('/api/v1/ch-ms-category-management-pricing/categories', async (req, res) => {
  const db = await leerDb();
  const { optionName, categoryName, pageSize = 10, pageNumber = 1, sortBy = 'categoryName' } = req.query;
  
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
  const indiceInicio = (pageNumber - 1) * pageSize;
  const indiceFin = indiceInicio + parseInt(pageSize);
  
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
              pageNumber: parseInt(pageNumber),
              pageSize: parseInt(pageSize),
              totalRecords: totalRegistros
            },
            categoryList: categoriasPaginadas
          }
        }
      }
    }
  });
});

// Validar nombre de categoría
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

// Endpoint del panel de control
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Endpoints de configuración
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

app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});