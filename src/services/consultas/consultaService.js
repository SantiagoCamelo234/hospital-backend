// src/services/consultas/consultaService.js
/**
 * ConsultaService
 * - Encapsula la lógica de negocio relacionada con las consultas médicas.
 * - Valida existencia de cita/medico/paciente antes de crear la consulta.
 * - Registra auditoría en cada operación relevante.
 * - Soporta generación de informes de consulta de forma asíncrona (worker).
 */

const Validator = require("../../utils/validator");
const DateUtils = require("../../utils/dateUtils");
const { runReportWorker } = require("../../workers/reportWorkerMain");

class ConsultaService {
  /**
   * @param {Object} repos - Repositorios necesarios:
   *   { consultaRepo, citaRepo, medicoRepo, pacienteRepo, auditoriaRepo }
   */
  constructor(repos, citaService = null, usuarioRepo = null) {
    if (!repos || !repos.consultaRepo) {
      throw new Error("ConsultaService requiere consultaRepo");
    }
    this.consultaRepo = repos.consultaRepo;
    this.citaRepo = repos.citaRepo;
    this.medicoRepo = repos.medicoRepo;
    this.pacienteRepo = repos.pacienteRepo;
    this.auditoriaRepo = repos.auditoriaRepo;
    this.citaService = citaService;
    this.usuarioRepo = usuarioRepo;
  }

  /**
   * Crear una nueva consulta asociada a una cita
   * Verifica que la cita, paciente y médico existan antes de persistir.
   *
   * @param {Object} data - { cita_id, medico_id, paciente_id, diagnostico, tratamiento, observaciones, fecha_consulta }
   * @param {String|Number} usuarioId - Id del usuario que realiza la acción (para auditoría)
   */
  async crearConsulta(data, usuarioId) {
    // Validaciones básicas
    if (!data) throw new Error("Datos de consulta requeridos");
    if (!data.cita_id) throw new Error("cita_id es obligatorio");
    if (!data.medico_id) throw new Error("medico_id es obligatorio");
    if (!data.paciente_id) throw new Error("paciente_id es obligatorio");

    // Verificar existencia (si repos están disponibles)
    const checks = [];

    if (this.citaRepo && this.citaRepo.findById) {
      checks.push(this.citaRepo.findById(data.cita_id));
    } else {
      checks.push(Promise.resolve(null));
    }

    if (this.medicoRepo && this.medicoRepo.findById) {
      checks.push(this.medicoRepo.findById(data.medico_id));
    } else {
      checks.push(Promise.resolve(null));
    }

    if (this.pacienteRepo && this.pacienteRepo.findById) {
      checks.push(this.pacienteRepo.findById(data.paciente_id));
    } else {
      checks.push(Promise.resolve(null));
    }

    const [cita, medico, paciente] = await Promise.all(checks);

    if (!cita) throw new Error("Cita no encontrada");
    if (!medico) throw new Error("Médico no encontrado");
    if (!paciente) throw new Error("Paciente no encontrado");

    // Opcional: validar que la cita no tenga ya una consulta registrada (si aplica)
    // Dependiendo de tu modelo, la cita puede relacionarse 1:1 con consulta.
    // Aquí intentamos buscar si ya existe (repo puede no tener método).
    if (this.consultaRepo && this.consultaRepo.findByCitaId) {
      const existente = await this.consultaRepo.findByCitaId(data.cita_id);
      if (existente && existente.length > 0) {
        throw new Error("La cita ya tiene una consulta asociada");
      }
    }

    // Normalizar datos mínimos
    const consultaPayload = {
      cita_id: data.cita_id,
      medico_id: data.medico_id,
      paciente_id: data.paciente_id,
      diagnostico: (data.diagnostico || "").trim(),
      tratamiento: (data.tratamiento || "").trim(),
      observaciones: (data.observaciones || "").trim(),
      fecha_consulta: data.fecha_consulta
        ? new Date(data.fecha_consulta)
        : new Date(),
    };

    // Persistir
    const created = await this.consultaRepo.create(consultaPayload);

    // Actualizar estado de la cita a "realizada"
    if (this.citaService && data.cita_id) {
      try {
        await this.citaService.actualizarEstadoCita(data.cita_id, "realizada", usuarioId);
      } catch (error) {
        // No lanzar error, solo registrar. La consulta ya fue creada.
      }
    }

    // Auditoría
    if (this.auditoriaRepo && this.auditoriaRepo.logAction) {
      await this.auditoriaRepo
        .logAction({
          entidad: "consulta",
          operacion: "create",
          registro_id: created.id || created._id,
          usuario_id: usuarioId,
          datos_nuevos: created,
        })
        .catch((err) => {
          // No se pudo registrar auditoría (create consulta)
        });
    }

    return created;
  }

  /**
   * Listar todas las consultas (posible paginación en repo)
   * @param {String|Number} pacienteId - Opcional: filtrar por paciente_id
   */
  async listarConsultas(pacienteId = null, medicoId = null) {
    if (pacienteId) {
      return await this.consultaRepo.findByPaciente(pacienteId);
    }
    if (medicoId) {
      return await this.consultaRepo.findByMedico(medicoId);
    }
    return await this.consultaRepo.findAll();
  }

  /**
   * Buscar consulta por id
   * @param {String|Number} id
   */
  async buscarPorId(id) {
    if (!id) throw new Error("Id requerido");
    const consulta = await this.consultaRepo.findById(id);
    if (!consulta) throw new Error("Consulta no encontrada");
    return consulta;
  }

  /**
   * Actualizar una consulta
   * @param {String|Number} id
   * @param {Object} updates
   * @param {String|Number} usuarioId
   */
  async actualizarConsulta(id, updates, usuarioId) {
    if (!id) throw new Error("Id es requerido");
    const anterior = await this.consultaRepo.findById(id);
    if (!anterior) throw new Error("Consulta no encontrada");

    // Validaciones opcionales
    if (updates.fecha_consulta && !Validator.isDate(updates.fecha_consulta)) {
      throw new Error("fecha_consulta inválida");
    }

    // Preparar payload de actualización
    const payload = {
      ...updates,
      updated_at: DateUtils.now(),
    };

    const actualizado = await this.consultaRepo.update(id, payload);

    // Auditoría
    if (this.auditoriaRepo && this.auditoriaRepo.logAction) {
      await this.auditoriaRepo
        .logAction({
          entidad: "consulta",
          operacion: "update",
          registro_id: id,
          usuario_id: usuarioId,
          datos_anteriores: anterior,
          datos_nuevos: actualizado,
        })
        .catch((err) => {
          // No se pudo registrar auditoría (update consulta)
        });
    }

    return actualizado;
  }

  /**
   * Eliminar (o borrar físicamente según repo) una consulta
   * @param {String|Number} id
   * @param {String|Number} usuarioId
   */
  async eliminarConsulta(id, usuarioId) {
    if (!id) throw new Error("Id requerido");
    const anterior = await this.consultaRepo.findById(id);
    if (!anterior) throw new Error("Consulta no encontrada");

    // Dependiendo del repo: delete puede ser físico o lógico
    await this.consultaRepo.delete(id);

    // Auditoría
    if (this.auditoriaRepo && this.auditoriaRepo.logAction) {
      await this.auditoriaRepo
        .logAction({
          entidad: "consulta",
          operacion: "delete",
          registro_id: id,
          usuario_id: usuarioId,
          datos_anteriores: anterior,
        })
        .catch((err) => {
          // No se pudo registrar auditoría (delete consulta)
        });
    }

    return { success: true };
  }

  /**
   * Generar informe de consulta de forma asíncrona (worker)
   * Devuelve el resultado que retorne el worker (puedes cambiar para almacenar en storage y retornar URL).
   *
   * @param {Object} filtros - filtros para el reporte (rango de fechas, medicoId, pacienteId, etc.)
   */
  async generarInformeAsync(filtros = {}) {
    // Ejecuta worker que hace el procesamiento (CPU/IO pesado)
    // El worker puede consultar la base de datos por su cuenta, o tú le pasas los datos.
    try {
      const payload = { type: "consulta-report", filtros };
      const result = await runReportWorker(payload);
      // result puede ser { success: true, result: { ... } } o similar según la implementación del worker
      return result;
    } catch (err) {
      throw new Error("No se pudo generar el informe de forma asíncrona");
    }
  }
}

module.exports = ConsultaService;
