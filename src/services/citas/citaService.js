// src/services/citas/citaService.js
const { runReportWorker } = require("../../workers/reportWorkerMain");

class CitaService {
  constructor(citaRepo, medicoRepo, pacienteRepo, auditoriaRepo, usuarioRepo = null) {
    this.citaRepo = citaRepo;
    this.medicoRepo = medicoRepo;
    this.pacienteRepo = pacienteRepo;
    this.auditoriaRepo = auditoriaRepo;
    this.usuarioRepo = usuarioRepo;
  }

  async crearCita(data, usuarioId, userRole = null, userEmail = null) {
    try {
      if (!data) throw new Error("Datos de la cita requeridos");
      if (!data.medico_id) throw new Error("ID del médico requerido");

      // Si el usuario es paciente, buscar su ID de paciente por email
      let pacienteId = data.paciente_id;
      if (userRole === "paciente") {
        // Si no hay email en el token, buscarlo desde la base de datos
        let email = userEmail;
        if (!email && usuarioId && this.usuarioRepo) {
          try {
            const usuario = await this.usuarioRepo.findById(usuarioId);
            if (usuario && usuario.email) {
              email = usuario.email;
            }
          } catch (error) {
            // Error al buscar email del usuario
          }
        }

        if (email) {
          const paciente = await this.pacienteRepo.findByEmail(email);
          if (!paciente) {
            throw new Error("No se encontró el registro de paciente asociado a tu cuenta. Por favor, contacta al administrador.");
          }
          pacienteId = paciente.id || paciente._id;
          data.paciente_id = pacienteId;
        } else {
          throw new Error("No se pudo obtener el email del usuario. Por favor, inicia sesión nuevamente.");
        }
      }

      if (!pacienteId) {
        throw new Error("ID del paciente requerido");
      }

      // Ejecutar validaciones en paralelo
      const [medico, paciente] = await Promise.all([
        this.medicoRepo.findById(data.medico_id),
        this.pacienteRepo.findById(pacienteId),
      ]);

      if (!medico) throw new Error("Médico no encontrado");
      if (!paciente) throw new Error("Paciente no encontrado");

      const cita = await this.citaRepo.create(data);

      // Auditar creación (no bloquear si falla)
      this.auditoriaRepo.logAction({
        entidad: "cita",
        operacion: "create",
        registro_id: cita.id || cita._id,
        usuario_id: usuarioId,
        datos_nuevos: cita,
      }).catch((err) => {
        // Error en auditoría (crear cita)
      });

      return cita;
    } catch (error) {
      throw error;
    }
  }

  async listarCitas(medicoId = null) {
    try {
      if (medicoId) {
        return await this.citaRepo.findByMedico(medicoId);
      }
      return await this.citaRepo.findAll();
    } catch (error) {
      throw error;
    }
  }

  async actualizarEstadoCita(citaId, nuevoEstado, usuarioId) {
    try {
      if (!citaId) throw new Error("ID de la cita requerido");
      if (!nuevoEstado) throw new Error("Nuevo estado requerido");

      const estadosValidos = ["pendiente", "confirmada", "cancelada", "realizada"];
      if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error(`Estado inválido. Debe ser uno de: ${estadosValidos.join(", ")}`);
      }

      const citaAnterior = await this.citaRepo.findById(citaId);
      if (!citaAnterior) throw new Error("Cita no encontrada");

      const citaActualizada = await this.citaRepo.update(citaId, { estado: nuevoEstado });

      // Auditar actualización (no bloquear si falla)
      this.auditoriaRepo.logAction({
        entidad: "cita",
        operacion: "update",
        registro_id: citaId,
        usuario_id: usuarioId,
        datos_anteriores: citaAnterior,
        datos_nuevos: citaActualizada,
      }).catch((err) => {
        // Error en auditoría (actualizar estado cita)
      });

      return citaActualizada;
    } catch (error) {
      throw error;
    }
  }

  async generarReporteAsync(filtros) {
    try {
      // Ejecuta un worker concurrente sin bloquear el servidor
      const result = await runReportWorker({ type: "citas", filtros });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CitaService;
