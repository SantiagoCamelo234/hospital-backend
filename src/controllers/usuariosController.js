// src/controllers/usuariosController.js

module.exports = (usuarioService) => ({
  listarUsuarios: async (req, res, next) => {
    try {
      const usuarios = await usuarioService.listarUsuarios();
      res.json({ success: true, data: usuarios });
    } catch (error) {
      next(error);
    }
  },

  obtenerUsuario: async (req, res, next) => {
    try {
      const usuario = await usuarioService.obtenerUsuario(req.params.id);
      res.json({ success: true, data: usuario });
    } catch (error) {
      next(error);
    }
  },

  actualizarUsuario: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const actualizado = await usuarioService.actualizarUsuario(
        req.params.id,
        req.body,
        userId
      );
      res.json({ success: true, data: actualizado });
    } catch (error) {
      next(error);
    }
  },

  eliminarUsuario: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const result = await usuarioService.eliminarUsuario(req.params.id, userId);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
});
