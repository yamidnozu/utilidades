// server.js
const cors = require("cors");
const express = require("express");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3939;

// Definir una lista de orígenes permitidos
const whitelist = ["http://localhost:4200", "http://localhost:9000","http://localhost:3939"];

// Configurar CORS con una función para verificar el origen
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (por ejemplo, Postman o CURL)
    if (!origin) return callback(null, true);

    if (whitelist.indexOf(origin) !== -1) {
      // El origen está permitido
      callback(null, true);
    } else {
      // El origen no está permitido
      callback(new Error("CORS no permitido para este origen"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "message-id",
    "document-type",
    "document-number",
    "transaction-code",
    "Company-Name",
    "Company-Id",
    "Doc-Type",
    "User-Id",
    "Timestamp",
    "Ip",
    "App-Id",
    "App-Module",
    "app-version",
    "application-id",
    "cache-control",
    "channel",
    "cookie",
    "device-id",
    "device-info",
    "origin",
    "platform-type",
    "pragma",
    "priority",
    "referer",
    "request-timestamp",
    "sec-ch-ua",
    "sec-ch-ua-mobile",
    "sec-ch-ua-platform",
    "sec-fetch-dest",
    "sec-fetch-mode",
    "sec-fetch-site",
    "session-tracker",
    "user-agent",
    "validate-captcha",
    "x-dtc",
    "request-timestamp-rcc",
    "appid",
    "companyid",
    "appmodule",
    "userid", 
    // Añade cualquier otro encabezado personalizado que utilices
  ],
  credentials: true, // Permitir el envío de credenciales (cookies, Authorization headers, etc.)
  optionsSuccessStatus: 200,
};

// Aplicar el middleware de CORS
app.use(cors(corsOptions));

// Manejar las solicitudes preflight
app.options("*", cors(corsOptions));

// Usa solo express.json() para parsear JSON
app.use(express.json());

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Ruta absoluta correcta para config.json
const CONFIG_PATH = path.join(__dirname, "config.json");

// Rutas CRUD para configuraciones

// Ruta para obtener todas las configuraciones
app.get("/api/configurations", (req, res) => {
  fs.readFile(CONFIG_PATH, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer config.json:", err);
      return res
        .status(500)
        .json({ message: "Error al leer las configuraciones" });
    }
    let configs;
    try {
      configs = JSON.parse(data);
      if (!Array.isArray(configs)) {
        throw new Error("config.json no es un arreglo");
      }
    } catch (parseError) {
      console.error("Error al parsear config.json:", parseError);
      return res
        .status(500)
        .json({ message: "Error al parsear las configuraciones" });
    }
    res.json(configs);
  });
});

// Ruta para agregar una nueva configuración
app.post("/api/configurations", (req, res) => {
  const newConfig = req.body;
  fs.readFile(CONFIG_PATH, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer config.json:", err);
      return res
        .status(500)
        .json({ message: "Error al leer las configuraciones" });
    }
    let configs;
    try {
      configs = JSON.parse(data);
      if (!Array.isArray(configs)) {
        throw new Error("config.json no es un arreglo");
      }
    } catch (parseError) {
      console.error("Error al parsear config.json:", parseError);
      return res
        .status(500)
        .json({ message: "Error al parsear las configuraciones" });
    }

    newConfig.id = configs.length ? configs[configs.length - 1].id + 1 : 1;
    configs.push(newConfig);

    fs.writeFile(CONFIG_PATH, JSON.stringify(configs, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir config.json:", err);
        return res
          .status(500)
          .json({ message: "Error 1 al guardar la configuración" });
      }
      res.json({
        message: "Configuración agregada exitosamente",
        config: newConfig,
      });
    });
  });
});

// Ruta para actualizar una configuración existente
app.put("/api/configurations/:id", (req, res) => {
  const configId = parseInt(req.params.id, 10);
  const updatedConfig = req.body;
  fs.readFile(CONFIG_PATH, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer config.json:", err);
      return res
        .status(500)
        .json({ message: "Error al leer las configuraciones" });
    }
    let configs;
    try {
      configs = JSON.parse(data);
      if (!Array.isArray(configs)) {
        throw new Error("config.json no es un arreglo");
      }
    } catch (parseError) {
      console.error("Error al parsear config.json:", parseError);
      return res
        .status(500)
        .json({ message: "Error al parsear las configuraciones" });
    }

    const index = configs.findIndex((config) => config.id === configId);
    if (index === -1) {
      return res.status(404).json({ message: "Configuración no encontrada" });
    }

    configs[index] = { ...configs[index], ...updatedConfig };

    fs.writeFile(CONFIG_PATH, JSON.stringify(configs, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir config.json:", err);
        return res
          .status(500)
          .json({ message: "Error al actualizar la configuración" });
      }
      res.json({
        message: "Configuración actualizada exitosamente",
        config: configs[index],
      });
    });
  });
});

// Ruta para eliminar una configuración
app.delete("/api/configurations/:id", (req, res) => {
  const configId = parseInt(req.params.id, 10);
  fs.readFile(CONFIG_PATH, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer config.json:", err);
      return res
        .status(500)
        .json({ message: "Error al leer las configuraciones" });
    }
    let configs;
    try {
      configs = JSON.parse(data);
      if (!Array.isArray(configs)) {
        throw new Error("config.json no es un arreglo");
      }
    } catch (parseError) {
      console.error("Error al parsear config.json:", parseError);
      return res
        .status(500)
        .json({ message: "Error al parsear las configuraciones" });
    }

    const index = configs.findIndex((config) => config.id === configId);
    if (index === -1) {
      return res.status(404).json({ message: "Configuración no encontrada" });
    }

    const removedConfig = configs.splice(index, 1);

    fs.writeFile(CONFIG_PATH, JSON.stringify(configs, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir config.json:", err);
        return res
          .status(500)
          .json({ message: "Error al eliminar la configuración" });
      }
      res.json({
        message: "Configuración eliminada exitosamente",
        config: removedConfig[0],
      });
    });
  });
});

// Ruta para probar una configuración específica
app.post("/api/test-endpoint", async (req, res) => {
  const { configId, testType, serviceName, planType } = req.body;

  if (!configId || !testType) {
    return res
      .status(400)
      .json({ message: "configId y testType son requeridos" });
  }

  fs.readFile(CONFIG_PATH, "utf8", async (err, data) => {
    if (err) {
      console.error("Error al leer config.json:", err);
      return res
        .status(500)
        .json({ message: "Error al leer las configuraciones" });
    }

    let configs;
    try {
      configs = JSON.parse(data);
      if (!Array.isArray(configs)) {
        throw new Error("config.json no es un arreglo");
      }
    } catch (parseError) {
      console.error("Error al parsear config.json:", parseError);
      return res
        .status(500)
        .json({ message: "Error al parsear las configuraciones" });
    }

    const config = configs.find((c) => c.id === configId);
    if (!config) {
      return res.status(404).json({ message: "Configuración no encontrada" });
    }

    try {
      if (testType === "mockSuccess") {
        // Para POST, se usa serviceName; para GET, se usa planType
        if (config.method.toLowerCase() === "get") {
          const selectedPlanType = config.selectedPlanType;
          const response = config.mockResponses[selectedPlanType];
          if (!response) {
            return res.status(400).json({
              message: `No hay respuesta mock definida para planType: ${selectedPlanType}`,
            });
          }
          return res.status(config.statusCode || 200).json(response);
        } else if (config.method.toLowerCase() === "post") {
          const response = config.mockResponses[serviceName];
          if (!response) {
            return res.status(400).json({
              message: `No hay respuesta mock definida para serviceName: ${serviceName}`,
            });
          }
          return res.status(config.statusCode || 200).json(response);
        } else {
          return res
            .status(501)
            .json({ message: "Método HTTP no implementado para mockSuccess" });
        }
      } else if (testType === "mockError") {
        return res.status(config.statusCode || 400).json(config.mockError);
      } else if (testType === "real") {
        if (!config.externalUrl) {
          return res.status(400).json({
            message: "No hay URL externa configurada para este endpoint",
          });
        }

        const headers = { ...config.headers };

        let axiosConfig = {
          method: config.method.toLowerCase(),
          url: config.externalUrl,
          headers: headers,
        };

        if (config.method.toLowerCase() === "get") {
          axiosConfig.params = planType ? { planType } : {};
        } else {
          axiosConfig.data = req.body;
        }

        const response = await axios(axiosConfig);

        return res.status(response.status).json(response.data);
      } else {
        return res.status(400).json({ message: "Tipo de prueba inválido" });
      }
    } catch (error) {
      console.error(`Error en prueba real: ${error.message}`);
      if (config.mockError) {
        return res.status(config.statusCode || 500).json(config.mockError);
      } else {
        return res
          .status(500)
          .json({ message: "Error al realizar la prueba real" });
      }
    }
  });
});

// Ruta dinámica para manejar todas las configuraciones
app.all("*", async (req, res) => {
  fs.readFile(CONFIG_PATH, "utf8", async (err, data) => {
    if (err) {
      console.error("Error al leer config.json:", err);
      return res
        .status(500)
        .json({ message: "Error al leer las configuraciones" });
    }
    let configs;
    try {
      configs = JSON.parse(data);
      if (!Array.isArray(configs)) {
        throw new Error("config.json no es un arreglo");
      }
    } catch (parseError) {
      console.error("Error al parsear config.json:", parseError);
      return res
        .status(500)
        .json({ message: "Error al parsear las configuraciones" });
    }

    const matchedConfig = configs.find(
      (config) =>
        config.path === req.path &&
        config.method.toLowerCase() === req.method.toLowerCase()
    );

    if (!matchedConfig) {
      return res.status(404).json({ message: "Endpoint no encontrado" });
    }

    if (matchedConfig.useMock) {
      if (matchedConfig.method.toLowerCase() === "post") {
        const serviceName = req.body.serviceName;
        if (!serviceName) {
          return res.status(400).json({
            message: "serviceName es requerido en el cuerpo de la solicitud",
          });
        }

        const response = matchedConfig.mockResponses[serviceName];
        if (!response) {
          return res.status(400).json({
            message: `No hay respuesta mock definida para serviceName: ${serviceName}`,
          });
        }

        return res.status(matchedConfig.statusCode || 200).json(response);
      } else if (matchedConfig.method.toLowerCase() === "get") {
        // Para solicitudes GET, usamos 'selectedPlanType' para seleccionar la respuesta mock
        const selectedPlanType = matchedConfig.selectedPlanType;
        if (!selectedPlanType) {
          return res.status(400).json({
            message: "selectedPlanType no está configurado para este endpoint",
          });
        }

        const response = matchedConfig.mockResponses[selectedPlanType];
        if (!response) {
          return res.status(400).json({
            message: `No hay respuesta mock definida para planType: ${selectedPlanType}`,
          });
        }

        return res.status(matchedConfig.statusCode || 200).json(response);
      } else {
        // Manejar otros métodos HTTP si es necesario
        return res
          .status(501)
          .json({ message: "Método HTTP no implementado para mock" });
      }
    } else {
      try {
        // Preparar los encabezados para la solicitud real
        const headers = { ...matchedConfig.headers };

        let axiosConfig = {
          method: matchedConfig.method.toLowerCase(),
          url: matchedConfig.externalUrl,
          headers: headers,
        };

        if (matchedConfig.method.toLowerCase() === "get") {
          axiosConfig.params = req.query;
        } else {
          axiosConfig.data = req.body;
        }

        // Realizar la solicitud real
        const response = await axios(axiosConfig);

        return res.status(response.status).json(response.data);
      } catch (error) {
        // Manejar errores y retornar el error mock si está definido
        console.error(`Error en solicitud real: ${error.message}`);
        if (matchedConfig.mockError) {
          return res
            .status(matchedConfig.statusCode || 500)
            .json(matchedConfig.mockError);
        } else {
          return res.status(500).json({
            message: "Error en el servidor al realizar la solicitud real",
          });
        }
      }
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// /* Inicio server.js */
// // server.js
// const cors = require("cors");
// const express = require("express");
// const axios = require("axios");
// const path = require("path");
// const fs = require("fs");

// const app = express();
// const PORT = 3939;

// // Configura CORS con el origen específico de tu aplicación Angular
// const corsOptions = {
//   origin: "http://localhost:4200", // Origen permitido
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "message-id",
//     "document-type",
//     "document-number",
//     "transaction-code",
//     "Company-Name",
//     "Company-Id",
//     "Doc-Type",
//     "User-Id",
//     "Timestamp",
//     "Ip",
//     "App-Id",
//     "App-Module",
//     "app-version",
//     "application-id",
//     "cache-control",
//     "channel",
//     "cookie",
//     "device-id",
//     "device-info",
//     "origin",
//     "platform-type",
//     "pragma",
//     "priority",
//     "referer",
//     "request-timestamp",
//     "sec-ch-ua",
//     "sec-ch-ua-mobile",
//     "sec-ch-ua-platform",
//     "sec-fetch-dest",
//     "sec-fetch-mode",
//     "sec-fetch-site",
//     "session-tracker",
//     "user-agent",
//     "validate-captcha",
//     "x-dtc",
//     // Añade cualquier otro encabezado personalizado que utilices
//   ],
//   credentials: true, // Mantén esto si necesitas enviar credenciales
//   optionsSuccessStatus: 200,
// };

// // Aplica el middleware de CORS
// app.use(cors(corsOptions));

// // Usa solo express.json() para parsear JSON
// app.use(express.json());

// // Sirve archivos estáticos desde la carpeta 'public'
// app.use(express.static(path.join(__dirname, "public")));

// // Maneja las solicitudes preflight
// app.options("*", cors(corsOptions));

// // Ruta absoluta correcta para config.json
// const CONFIG_PATH = path.join(__dirname, "config.json");

// // Rutas CRUD para configuraciones

// // Ruta para obtener todas las configuraciones
// app.get("/api/configurations", (req, res) => {
//   fs.readFile(CONFIG_PATH, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error al leer config.json:", err);
//       return res
//         .status(500)
//         .json({ message: "Error al leer las configuraciones" });
//     }
//     let configs;
//     try {
//       configs = JSON.parse(data);
//       if (!Array.isArray(configs)) {
//         throw new Error("config.json no es un arreglo");
//       }
//     } catch (parseError) {
//       console.error("Error al parsear config.json:", parseError);
//       return res
//         .status(500)
//         .json({ message: "Error al parsear las configuraciones" });
//     }
//     res.json(configs);
//   });
// });

// // Ruta para agregar una nueva configuración
// app.post("/api/configurations", (req, res) => {
//   const newConfig = req.body;
//   fs.readFile(CONFIG_PATH, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error al leer config.json:", err);
//       return res
//         .status(500)
//         .json({ message: "Error al leer las configuraciones" });
//     }
//     let configs;
//     try {
//       configs = JSON.parse(data);
//       if (!Array.isArray(configs)) {
//         throw new Error("config.json no es un arreglo");
//       }
//     } catch (parseError) {
//       console.error("Error al parsear config.json:", parseError);
//       return res
//         .status(500)
//         .json({ message: "Error al parsear las configuraciones" });
//     }

//     newConfig.id = configs.length ? configs[configs.length - 1].id + 1 : 1;
//     configs.push(newConfig);

//     fs.writeFile(CONFIG_PATH, JSON.stringify(configs, null, 2), (err) => {
//       if (err) {
//         console.error("Error al escribir config.json:", err);
//         return res
//           .status(500)
//           .json({ message: "Error al guardar la configuración" });
//       }
//       res.json({
//         message: "Configuración agregada exitosamente",
//         config: newConfig,
//       });
//     });
//   });
// });

// // Ruta para actualizar una configuración existente
// app.put("/api/configurations/:id", (req, res) => {
//   const configId = parseInt(req.params.id, 10);
//   const updatedConfig = req.body;
//   fs.readFile(CONFIG_PATH, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error al leer config.json:", err);
//       return res
//         .status(500)
//         .json({ message: "Error al leer las configuraciones" });
//     }
//     let configs;
//     try {
//       configs = JSON.parse(data);
//       if (!Array.isArray(configs)) {
//         throw new Error("config.json no es un arreglo");
//       }
//     } catch (parseError) {
//       console.error("Error al parsear config.json:", parseError);
//       return res
//         .status(500)
//         .json({ message: "Error al parsear las configuraciones" });
//     }

//     const index = configs.findIndex((config) => config.id === configId);
//     if (index === -1) {
//       return res.status(404).json({ message: "Configuración no encontrada" });
//     }

//     configs[index] = { ...configs[index], ...updatedConfig };

//     fs.writeFile(CONFIG_PATH, JSON.stringify(configs, null, 2), (err) => {
//       if (err) {
//         console.error("Error al escribir config.json:", err);
//         return res
//           .status(500)
//           .json({ message: "Error al actualizar la configuración" });
//       }
//       res.json({
//         message: "Configuración actualizada exitosamente",
//         config: configs[index],
//       });
//     });
//   });
// });

// // Ruta para eliminar una configuración
// app.delete("/api/configurations/:id", (req, res) => {
//   const configId = parseInt(req.params.id, 10);
//   fs.readFile(CONFIG_PATH, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error al leer config.json:", err);
//       return res
//         .status(500)
//         .json({ message: "Error al leer las configuraciones" });
//     }
//     let configs;
//     try {
//       configs = JSON.parse(data);
//       if (!Array.isArray(configs)) {
//         throw new Error("config.json no es un arreglo");
//       }
//     } catch (parseError) {
//       console.error("Error al parsear config.json:", parseError);
//       return res
//         .status(500)
//         .json({ message: "Error al parsear las configuraciones" });
//     }

//     const index = configs.findIndex((config) => config.id === configId);
//     if (index === -1) {
//       return res.status(404).json({ message: "Configuración no encontrada" });
//     }

//     const removedConfig = configs.splice(index, 1);

//     fs.writeFile(CONFIG_PATH, JSON.stringify(configs, null, 2), (err) => {
//       if (err) {
//         console.error("Error al escribir config.json:", err);
//         return res
//           .status(500)
//           .json({ message: "Error al eliminar la configuración" });
//       }
//       res.json({
//         message: "Configuración eliminada exitosamente",
//         config: removedConfig[0],
//       });
//     });
//   });
// });

// // Ruta para probar una configuración específica
// app.post("/api/test-endpoint", async (req, res) => {
//   const { configId, testType, serviceName, planType } = req.body;

//   if (!configId || !testType) {
//     return res
//       .status(400)
//       .json({ message: "configId y testType son requeridos" });
//   }

//   fs.readFile(CONFIG_PATH, "utf8", async (err, data) => {
//     if (err) {
//       console.error("Error al leer config.json:", err);
//       return res
//         .status(500)
//         .json({ message: "Error al leer las configuraciones" });
//     }

//     let configs;
//     try {
//       configs = JSON.parse(data);
//       if (!Array.isArray(configs)) {
//         throw new Error("config.json no es un arreglo");
//       }
//     } catch (parseError) {
//       console.error("Error al parsear config.json:", parseError);
//       return res
//         .status(500)
//         .json({ message: "Error al parsear las configuraciones" });
//     }

//     const config = configs.find((c) => c.id === configId);
//     if (!config) {
//       return res.status(404).json({ message: "Configuración no encontrada" });
//     }

//     try {
//       if (testType === "mockSuccess") {
//         // Para POST, se usa serviceName; para GET, se usa planType
//         if (config.method.toLowerCase() === "get") {
//           const selectedPlanType = config.selectedPlanType;
//           const response = config.mockResponses[selectedPlanType];
//           if (!response) {
//             return res
//               .status(400)
//               .json({
//                 message: `No hay respuesta mock definida para planType: ${selectedPlanType}`,
//               });
//           }
//           return res.status(config.statusCode || 200).json(response);
//         } else if (config.method.toLowerCase() === "post") {
//           const response = config.mockResponses[serviceName];
//           if (!response) {
//             return res
//               .status(400)
//               .json({
//                 message: `No hay respuesta mock definida para serviceName: ${serviceName}`,
//               });
//           }
//           return res.status(config.statusCode || 200).json(response);
//         } else {
//           return res
//             .status(501)
//             .json({ message: "Método HTTP no implementado para mockSuccess" });
//         }
//       } else if (testType === "mockError") {
//         return res.status(config.statusCode || 400).json(config.mockError);
//       } else if (testType === "real") {
//         if (!config.externalUrl) {
//           return res
//             .status(400)
//             .json({
//               message: "No hay URL externa configurada para este endpoint",
//             });
//         }

//         const headers = { ...config.headers };

//         let axiosConfig = {
//           method: config.method.toLowerCase(),
//           url: config.externalUrl,
//           headers: headers,
//         };

//         if (config.method.toLowerCase() === "get") {
//           axiosConfig.params = planType ? { planType } : {};
//         } else {
//           axiosConfig.data = req.body;
//         }

//         const response = await axios(axiosConfig);

//         return res.status(response.status).json(response.data);
//       } else {
//         return res.status(400).json({ message: "Tipo de prueba inválido" });
//       }
//     } catch (error) {
//       console.error(`Error en prueba real: ${error.message}`);
//       if (config.mockError) {
//         return res.status(config.statusCode || 500).json(config.mockError);
//       } else {
//         return res
//           .status(500)
//           .json({ message: "Error al realizar la prueba real" });
//       }
//     }
//   });
// });

// // Ruta dinámica para manejar todas las configuraciones
// app.all("*", async (req, res) => {
//   fs.readFile(CONFIG_PATH, "utf8", async (err, data) => {
//     if (err) {
//       console.error("Error al leer config.json:", err);
//       return res
//         .status(500)
//         .json({ message: "Error al leer las configuraciones" });
//     }
//     let configs;
//     try {
//       configs = JSON.parse(data);
//       if (!Array.isArray(configs)) {
//         throw new Error("config.json no es un arreglo");
//       }
//     } catch (parseError) {
//       console.error("Error al parsear config.json:", parseError);
//       return res
//         .status(500)
//         .json({ message: "Error al parsear las configuraciones" });
//     }

//     const matchedConfig = configs.find(
//       (config) =>
//         config.path === req.path &&
//         config.method.toLowerCase() === req.method.toLowerCase()
//     );

//     if (!matchedConfig) {
//       return res.status(404).json({ message: "Endpoint no encontrado" });
//     }

//     if (matchedConfig.useMock) {
//       if (matchedConfig.method.toLowerCase() === "post") {
//         const serviceName = req.body.serviceName;
//         if (!serviceName) {
//           return res
//             .status(400)
//             .json({
//               message: "serviceName es requerido en el cuerpo de la solicitud",
//             });
//         }

//         const response = matchedConfig.mockResponses[serviceName];
//         if (!response) {
//           return res
//             .status(400)
//             .json({
//               message: `No hay respuesta mock definida para serviceName: ${serviceName}`,
//             });
//         }

//         return res.status(matchedConfig.statusCode || 200).json(response);
//       } else if (matchedConfig.method.toLowerCase() === "get") {
//         // Para solicitudes GET, usamos 'selectedPlanType' para seleccionar la respuesta mock
//         const selectedPlanType = matchedConfig.selectedPlanType;
//         if (!selectedPlanType) {
//           return res
//             .status(400)
//             .json({
//               message:
//                 "selectedPlanType no está configurado para este endpoint",
//             });
//         }

//         const response = matchedConfig.mockResponses[selectedPlanType];
//         if (!response) {
//           return res
//             .status(400)
//             .json({
//               message: `No hay respuesta mock definida para planType: ${selectedPlanType}`,
//             });
//         }

//         return res.status(matchedConfig.statusCode || 200).json(response);
//       } else {
//         // Manejar otros métodos HTTP si es necesario
//         return res
//           .status(501)
//           .json({ message: "Método HTTP no implementado para mock" });
//       }
//     } else {
//       try {
//         // Preparar los encabezados para la solicitud real
//         const headers = { ...matchedConfig.headers };

//         let axiosConfig = {
//           method: matchedConfig.method.toLowerCase(),
//           url: matchedConfig.externalUrl,
//           headers: headers,
//         };

//         if (matchedConfig.method.toLowerCase() === "get") {
//           axiosConfig.params = req.query;
//         } else {
//           axiosConfig.data = req.body;
//         }

//         // Realizar la solicitud real
//         const response = await axios(axiosConfig);

//         return res.status(response.status).json(response.data);
//       } catch (error) {
//         // Manejar errores y retornar el error mock si está definido
//         console.error(`Error en solicitud real: ${error.message}`);
//         if (matchedConfig.mockError) {
//           return res
//             .status(matchedConfig.statusCode || 500)
//             .json(matchedConfig.mockError);
//         } else {
//           return res
//             .status(500)
//             .json({
//               message: "Error en el servidor al realizar la solicitud real",
//             });
//         }
//       }
//     }
//   });
// });

// // Iniciar el servidor
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });

// /* Fin server.js */
