// src/routes/auditoriaRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

module.exports = (controller) => {
  const {
    listarTodo,
    listarPorEntidad,
    listarPorUsuario,
    deshacerUltimaAccion,
  } = controller;

  router.get("/", auth, role(["admin"]), listarTodo);
  router.get("/entidad/:entidad", auth, role(["admin"]), listarPorEntidad);
  router.get("/usuario/:usuarioId", auth, role(["admin"]), listarPorUsuario);
  router.post("/undo/:entidad", auth, role(["admin"]), deshacerUltimaAccion);

  return router;
};
