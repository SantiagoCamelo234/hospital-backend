// src/routes/pacientesRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

module.exports = (controller) => {
  router.post(
    "/",
    auth,
    role(["admin"]),
    controller.crearPaciente
  );
  router.get("/", auth, controller.listarPacientes);
  router.get("/:id", auth, controller.obtenerPaciente);
  router.put(
    "/:id",
    auth,
    role(["admin"]),
    controller.actualizarPaciente
  );
  router.delete("/:id", auth, role(["admin"]), controller.eliminarPaciente);

  return router;
};
