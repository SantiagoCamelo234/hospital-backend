// src/controllers/pacientesController.js

module.exports = (pacienteService) => ({
  crearPaciente: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const paciente = await pacienteService.crearPaciente(req.body, userId);
      res.status(201).json({ success: true, data: paciente });
    } catch (error) {
      next(error);
    }
  },

  listarPacientes: async (req, res, next) => {
    try {
      const pacientes = await pacienteService.listarPacientes();
      res.json({ success: true, data: pacientes });
    } catch (error) {
      next(error);
    }
  },

  obtenerPaciente: async (req, res, next) => {
    try {
      const paciente = await pacienteService.buscarPorId(req.params.id);
      res.json({ success: true, data: paciente });
    } catch (error) {
      next(error);
    }
  },

  actualizarPaciente: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const actualizado = await pacienteService.actualizarPaciente(
        req.params.id,
        req.body,
        userId
      );
      res.json({ success: true, data: actualizado });
    } catch (error) {
      next(error);
    }
  },

  eliminarPaciente: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const result = await pacienteService.eliminarPaciente(
        req.params.id,
        userId
      );
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
});
