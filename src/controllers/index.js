// src/controllers/index.js
const pacientesController = require("./pacientesController");
const medicosController = require("./medicosController");
const citasController = require("./citasController");
const consultasController = require("./consultasController");
const usuariosController = require("./usuariosController");
const authController = require("./authController");
const auditoriaController = require("./auditoriaController");

module.exports = {
  pacientesController,
  medicosController,
  citasController,
  consultasController,
  usuariosController,
  authController,
  auditoriaController,
};
