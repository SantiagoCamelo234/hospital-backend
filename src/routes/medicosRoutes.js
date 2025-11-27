// src/routes/medicosRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

module.exports = (controller) => {
  router.post("/", auth, role(["admin"]), controller.crearMedico);
  router.get("/", auth, controller.listarMedicos);
  router.put("/:id", auth, role(["admin"]), controller.actualizarMedico);

  return router;
};
