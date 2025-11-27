// src/controllers/auditoriaController.js

module.exports = (auditoriaService, undoService) => ({
  listarTodo: async (req, res, next) => {
    try {
      const logs = await auditoriaService.listarTodo();
      res.json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  },

  listarPorEntidad: async (req, res, next) => {
    try {
      const logs = await auditoriaService.listarPorEntidad(req.params.entidad);
      res.json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  },

  listarPorUsuario: async (req, res, next) => {
    try {
      const logs = await auditoriaService.listarPorUsuario(req.params.usuarioId);
      res.json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  },

  deshacerUltimaAccion: async (req, res, next) => {
    try {
      const result = await undoService.deshacerUltimaAccion(req.params.entidad);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
});
