// src/routes/consultasRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

module.exports = (controller) => {
  router.post("/", auth, role(["medico"]), controller.crearConsulta);
  router.get("/", auth, role(["medico", "admin", "paciente"]), controller.listarConsultas);
  router.get(
    "/:id",
    auth,
    role(["medico", "admin", "paciente"]),
    controller.obtenerConsulta
  );
  router.put("/:id", auth, role(["medico"]), controller.actualizarConsulta);
  router.delete("/:id", auth, role(["admin"]), controller.eliminarConsulta);
  router.get(
    "/reporte/async",
    auth,
    role(["admin"]),
    controller.generarInforme
  );

  return router;
};
