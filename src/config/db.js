// src/config/db.js
require("dotenv").config();
const mongoose = require("mongoose");

let mongoDb = null;
let mongoConnected = false;

/**
 * Inicializa la conexión a MongoDB.
 */
async function initDatabases() {
  const connectMongo = process.env.MONGO_URI;

  // Conectar a MongoDB
  if (connectMongo) {
    try {
      mongoose.set("strictQuery", false);
      // Añadir opciones de conexión con timeout
      await Promise.race([
        mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout al conectar con MongoDB")), 10000)
        )
      ]);
      mongoDb = mongoose.connection;
      mongoConnected = true;
      
      // Manejar eventos de conexión
      mongoDb.on("error", (err) => {
        console.error(`Error en MongoDB: ${err.message}`);
        mongoConnected = false;
      });
      
      mongoDb.on("disconnected", () => {
        mongoConnected = false;
      });

      mongoDb.on("reconnected", () => {
        mongoConnected = true;
      });
    } catch (error) {
      console.error(`Error al conectar con MongoDB: ${error.message}`);
      mongoDb = null;
      mongoConnected = false;
      throw new Error(`No se pudo conectar a MongoDB: ${error.message}`);
    }
  } else {
    const errorMsg = " MONGO_URI no está configurado. Verifica la configuración.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return { 
    mongoDb: mongoDb ? mongoose : null, 
    mongoConnected,
    dbType: "mongodb"
  };
}

/**
 * Cierra la conexión a MongoDB
 */
async function closeDatabases() {
  if (mongoDb && mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
}

module.exports = { initDatabases, closeDatabases, getMongo: () => mongoDb };
