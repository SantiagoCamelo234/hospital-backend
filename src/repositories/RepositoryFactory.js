// src/repositories/RepositoryFactory.js
const MongoPacienteRepo = require("./pacientes/mongoPacienteRepo");
const MongoMedicoRepo = require("./medicos/mongoMedicoRepo");
const MongoCitaRepo = require("./citas/mongoCitaRepo");
const MongoConsultaRepo = require("./consultas/mongoConsultaRepo");
const MongoUsuarioRepo = require("./usuarios/mongoUsuarioRepo");
const MongoAuditoriaRepo = require("./auditoria/mongoAuditoriaRepo");

/**
 * Crea repositorios para MongoDB.
 * @param {Object} params - Parámetros de conexión
 * @param {Object} params.mongoDb - Conexión a MongoDB (Mongoose)
 * @param {boolean} params.mongoConnected - Si MongoDB está conectado
 */
function createRepositories({ mongoDb, mongoConnected }) {
  // Validar que MongoDB esté disponible
  if (!mongoConnected) {
    throw new Error("MongoDB no está conectado. Verifique la configuración.");
  }

  return {
    pacienteRepo: new MongoPacienteRepo(),
    medicoRepo: new MongoMedicoRepo(),
    citaRepo: new MongoCitaRepo(),
    consultaRepo: new MongoConsultaRepo(),
    usuarioRepo: new MongoUsuarioRepo(),
    auditoriaRepo: new MongoAuditoriaRepo(),
  };
}

module.exports = { createRepositories };




