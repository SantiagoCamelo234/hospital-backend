// src/controllers/citasController.js

module.exports = (citaService) => ({
  crearCita: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const userRole = req.user?.role || req.user?.rol || null;
      const userEmail = req.user?.email || null;
      const cita = await citaService.crearCita(req.body, userId, userRole, userEmail);
      res.status(201).json({ success: true, data: cita });
    } catch (error) {
      next(error);
    }
  },

  listarCitas: async (req, res, next) => {
    try {
    const userRole = req.user?.role || req.user?.rol || null;
    let medicoId = null;

    // Si el usuario es médico, obtener su ID de médico
    if (userRole === "medico") {
      let userEmail = req.user?.email || null;
      
      // Si no hay email en el token, buscarlo desde la base de datos
      if (!userEmail && req.user?.id && citaService.usuarioRepo) {
        try {
          const usuario = await citaService.usuarioRepo.findById(req.user.id);
          if (usuario && usuario.email) {
            userEmail = usuario.email;
          }
        } catch (error) {
          // Error silencioso, continuar sin filtrar
        }
      }

      if (userEmail && citaService.medicoRepo) {
        try {
          const medico = await citaService.medicoRepo.findByEmail(userEmail);
          if (medico) {
            medicoId = medico.id || medico._id;
          }
        } catch (error) {
          // Error silencioso, continuar sin filtrar
        }
      }
    }

      const citas = await citaService.listarCitas(medicoId);
      res.json({ success: true, data: citas });
    } catch (error) {
      next(error);
    }
  },

  actualizarEstadoCita: async (req, res, next) => {
    try {
      const userId = req.user?.id || null;
      const { estado } = req.body;
      const cita = await citaService.actualizarEstadoCita(req.params.id, estado, userId);
      res.json({ success: true, data: cita });
    } catch (error) {
      next(error);
    }
  },

  generarReporte: async (req, res, next) => {
    try {
      const reporte = await citaService.generarReporteAsync(req.query);
      res.json({ success: true, data: reporte });
    } catch (error) {
      next(error);
    }
  },
});
