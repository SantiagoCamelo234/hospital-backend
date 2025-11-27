// src/controllers/medicosController.js

module.exports = (medicoService) => ({
  crearMedico: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const medico = await medicoService.crearMedico(req.body, userId);
      res.status(201).json({ success: true, data: medico });
    } catch (error) {
      next(error);
    }
  },

  listarMedicos: async (req, res, next) => {
    try {
      const medicos = await medicoService.listarMedicos();
      res.json({ success: true, data: medicos });
    } catch (error) {
      next(error);
    }
  },

  actualizarMedico: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const actualizado = await medicoService.actualizarMedico(
        req.params.id,
        req.body,
        userId
      );
      res.json({ success: true, data: actualizado });
    } catch (error) {
      next(error);
    }
  },
});
