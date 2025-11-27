// src/routes/citasRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

module.exports = (controller) => {
  router.post(
    "/",
    auth,
    role(["admin", "medico", "paciente"]),
    controller.crearCita
  );
  router.get("/", auth, controller.listarCitas);
  router.patch(
    "/:id/estado",
    auth,
    role(["admin", "medico", "paciente"]),
    controller.actualizarEstadoCita
  );
  router.get("/reporte", auth, role(["admin"]), controller.generarReporte);

  return router;
};
