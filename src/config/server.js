// src/config/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { initDatabases } = require("./db");
const routes = require("../routes");
const errorHandler = require("../middlewares/errorHandler");

/**
 * Inicializa y arranca el servidor con la base de datos
 */
async function startServer() {
  const app = express();
  const { mongoDb, dbType, mongoConnected } = await initDatabases();

  // Middlewares globales
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(morgan("dev"));

  // Rutas principales
  app.use("/api", routes({ mongoDb, dbType, mongoConnected }));

  // Middleware de manejo de errores
  app.use(errorHandler);

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT} | DB: ${dbType}`);
  });
}

module.exports = { startServer };
