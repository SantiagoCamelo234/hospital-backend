// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();

module.exports = (controller) => {
  router.post("/register", controller.registrar);
  router.post("/login", controller.login);

  return router;
};
