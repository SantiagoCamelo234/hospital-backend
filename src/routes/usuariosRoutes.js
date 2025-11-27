// src/routes/usuariosRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

module.exports = (controller) => {
  router.get("/", auth, role(["admin"]), controller.listarUsuarios);
  router.get("/:id", auth, role(["admin"]), controller.obtenerUsuario);
  router.put("/:id", auth, role(["admin"]), controller.actualizarUsuario);
  router.delete("/:id", auth, role(["admin"]), controller.eliminarUsuario);

  return router;
};
