// src/routes/index.js
const express = require("express");
const router = express.Router();

// Controladores (factories)
const {
  pacientesController,
  medicosController,
  citasController,
  consultasController,
  usuariosController,
  authController,
  auditoriaController,
} = require("../controllers");

// Importar servicios desde la capa de negocio
const {
  PacienteService,
  MedicoService,
  CitaService,
  UsuarioService,
  AuthService,
  AuditoriaService,
  UndoService,
} = require("../services");

// Fábrica de repositorios según tipo de DB
const RepositoryFactory = require("../repositories/RepositoryFactory");

/**
 * Configura las rutas de la API con los repositorios correspondientes
 * @param {Object} dbConfig - Configuración de bases de datos
 * @param {Object} dbConfig.mongoDb - Conexión a MongoDB
 * @param {string} dbConfig.dbType - Tipo de DB a usar ('mongodb')
 * @param {boolean} dbConfig.mongoConnected - Si MongoDB está conectado
 */
function setupRoutes({ mongoDb, dbType, mongoConnected }) {
  // Obtener repositorios para MongoDB
  const repos = RepositoryFactory.createRepositories({
    mongoDb,
    mongoConnected: mongoConnected !== undefined ? mongoConnected : !!mongoDb,
  });

  // Instanciar servicios
  const pacienteService = new PacienteService(
    repos.pacienteRepo,
    repos.auditoriaRepo
  );
  const medicoService = new MedicoService(repos.medicoRepo, repos.auditoriaRepo);
  const citaService = new CitaService(
    repos.citaRepo,
    repos.medicoRepo,
    repos.pacienteRepo,
    repos.auditoriaRepo,
    repos.usuarioRepo
  );
  const usuarioService = new UsuarioService(
    repos.usuarioRepo,
    repos.auditoriaRepo
  );
  const authService = new AuthService(
    repos.usuarioRepo,
    repos.pacienteRepo,
    repos.medicoRepo
  );
  const auditoriaService = new AuditoriaService(repos.auditoriaRepo);
  const undoService = new UndoService(repos.auditoriaRepo, repos);

  // Instanciar controladores
  const pacientesCtrl = pacientesController(pacienteService);
  const medicosCtrl = medicosController(medicoService);
  const citasCtrl = citasController(citaService);
  const consultasCtrl = consultasController(
    new (require("../services/consultas/consultaService"))(
      {
        consultaRepo: repos.consultaRepo,
        citaRepo: repos.citaRepo,
        medicoRepo: repos.medicoRepo,
        pacienteRepo: repos.pacienteRepo,
        auditoriaRepo: repos.auditoriaRepo,
      },
      citaService,
      repos.usuarioRepo
    )
  );
  const usuariosCtrl = usuariosController(usuarioService);
  const authCtrl = authController(authService);
  const auditoriaCtrl = auditoriaController(auditoriaService, undoService);

  // Montar rutas con prefijos
  router.use("/auth", require("./authRoutes")(authCtrl));
  router.use("/pacientes", require("./pacientesRoutes")(pacientesCtrl));
  router.use("/medicos", require("./medicosRoutes")(medicosCtrl));
  router.use("/citas", require("./citasRoutes")(citasCtrl));
  router.use("/consultas", require("./consultasRoutes")(consultasCtrl));
  router.use("/usuarios", require("./usuariosRoutes")(usuariosCtrl));
  router.use("/auditoria", require("./auditoriaRoutes")(auditoriaCtrl));

  return router;
}

module.exports = setupRoutes;
