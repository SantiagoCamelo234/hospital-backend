
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const { initDatabases } = require("./src/config/db");
const setupRoutes = require("./src/routes");
const errorHandler = require("./src/middlewares/errorHandler");


async function startServer() {
  try {
    // Inicializar conexión a MongoDB
    const { mongoDb, dbType, mongoConnected } = await initDatabases();

    // Crear aplicación Express
    const app = express();

   
    // Configurar CORS para permitir peticiones del frontend
    app.use(cors({
      origin: "*",
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));
    
    // Morgan con formato personalizado para ver todas las peticiones
    app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
    

  
    app.use("/tmp", express.static(path.join(__dirname, "tmp")));

 
    app.get("/health", (req, res) => {
      res.json({
        success: true,
        message: " Servidor activo y saludable",
        timestamp: new Date().toISOString(),
        databases: {
          mongodb: mongoConnected ? "conectado" : "desconectado",
          active: dbType,
        },
      });
    });


    const routes = setupRoutes({
      mongoDb,
      dbType,
      mongoConnected,
    });
    app.use("/api/v1", routes);


    app.use(errorHandler);

    
    // 🔹 6. Iniciar servidor
    
    const PORT = process.env.PORT || 8081;
    const server = app.listen(PORT, () => {
      console.log(` Servidor corriendo en puerto ${PORT}`);
      
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(` El puerto ${PORT} ya está en uso.`);
        
        process.exit(1);
      } else {
        console.error(` Error al iniciar el servidor: ${error.message}`);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error(` Error al iniciar el servidor: ${error.message}`);
    if (error.stack) {
      console.error(`Stack trace: ${error.stack}`);
    }
    process.exit(1);
  }
}


// 🔹 7. Captura global de errores no controlados

process.on("uncaughtException", (err) => {
  console.error(`Excepción no controlada: ${err.message}`);
  if (err.stack) {
    console.error(`Stack trace: ${err.stack}`);
  }
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  const errorMessage = reason instanceof Error ? reason.message : String(reason);
  console.error(` Promesa rechazada sin manejar: ${errorMessage}`);
  if (reason instanceof Error && reason.stack) {
    console.error(`Stack trace: ${reason.stack}`);
  }
  
});

// Iniciar el servidor
startServer();
