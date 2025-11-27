// src/controllers/consultasController.js

module.exports = (consultaService) => ({
  crearConsulta: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const consulta = await consultaService.crearConsulta(req.body, userId);
      res.status(201).json({ success: true, data: consulta });
    } catch (error) {
      next(error);
    }
  },

  listarConsultas: async (req, res, next) => {
    try {
    const userRole = req.user?.role || req.user?.rol || null;
    let pacienteId = null;
    let medicoId = null;

    // Si el usuario es paciente, obtener su ID de paciente
    if (userRole === "paciente") {
      let userEmail = req.user?.email || null;
      
      // Si no hay email en el token, buscarlo desde la base de datos
      if (!userEmail && req.user?.id && consultaService.usuarioRepo) {
        try {
          const usuario = await consultaService.usuarioRepo.findById(req.user.id);
          if (usuario && usuario.email) {
            userEmail = usuario.email;
          }
        } catch (error) {
          // Error al buscar email del usuario
        }
      }

      if (userEmail && consultaService.pacienteRepo) {
        try {
          const paciente = await consultaService.pacienteRepo.findByEmail(userEmail);
          if (paciente) {
            pacienteId = paciente.id || paciente._id;
          }
        } catch (error) {
          // Error al buscar paciente por email
        }
      }
    }

    // Si el usuario es médico, obtener su ID de médico
    if (userRole === "medico") {
      let userEmail = req.user?.email || null;
      
      // Si no hay email en el token, buscarlo desde la base de datos
      if (!userEmail && req.user?.id && consultaService.usuarioRepo) {
        try {
          const usuario = await consultaService.usuarioRepo.findById(req.user.id);
          if (usuario && usuario.email) {
            userEmail = usuario.email;
          }
        } catch (error) {
          // Error al buscar email del usuario
        }
      }

      if (userEmail && consultaService.medicoRepo) {
        try {
          const medico = await consultaService.medicoRepo.findByEmail(userEmail);
          if (medico) {
            medicoId = medico.id || medico._id;
          }
        } catch (error) {
          // Error al buscar médico por email
        }
      }
    }

      const consultas = await consultaService.listarConsultas(pacienteId, medicoId);
      res.json({ success: true, data: consultas });
    } catch (error) {
      next(error);
    }
  },

  obtenerConsulta: async (req, res, next) => {
    try {
      const consulta = await consultaService.buscarPorId(req.params.id);
      res.json({ success: true, data: consulta });
    } catch (error) {
      next(error);
    }
  },

  actualizarConsulta: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const actualizada = await consultaService.actualizarConsulta(
        req.params.id,
        req.body,
        userId
      );
      res.json({ success: true, data: actualizada });
    } catch (error) {
      next(error);
    }
  },

  eliminarConsulta: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const result = await consultaService.eliminarConsulta(
        req.params.id,
        userId
      );
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  generarInforme: async (req, res, next) => {
    try {
      const result = await consultaService.generarInformeAsync(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
});
