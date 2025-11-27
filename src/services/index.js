// src/services/index.js
const PacienteService = require("./pacientes/pacienteService");
const MedicoService = require("./medicos/medicoService");
const CitaService = require("./citas/citaService");
const ConsultaService = require("./consultas/consultaService");
const UsuarioService = require("./usuarios/usuarioService");
const AuthService = require("./usuarios/authService");
const AuditoriaService = require("./auditorias/auditoriaService");
const UndoService = require("./auditorias/undoService");

module.exports = {
  PacienteService,
  MedicoService,
  CitaService,
  ConsultaService,
  UsuarioService,
  AuthService,
  AuditoriaService,
  UndoService,
};
