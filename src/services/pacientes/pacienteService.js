// src/services/pacientes/pacienteService.js
const Validator = require("../../utils/validator");
const DateUtils = require("../../utils/dateUtils");

class PacienteService {
  constructor(pacienteRepo, auditoriaRepo) {
    this.pacienteRepo = pacienteRepo;
    this.auditoriaRepo = auditoriaRepo;
  }

  async crearPaciente(data, usuarioId) {
    try {
      if (!data) throw new Error("Datos del paciente requeridos");
      if (!Validator.isEmail(data.email)) throw new Error("Correo inválido");
      if (!Validator.isString(data.nombre)) throw new Error("Nombre obligatorio");

      const nuevoPaciente = await this.pacienteRepo.create({
        ...data,
        created_at: DateUtils.now(),
      });

      // Auditar creación (no bloquear si falla)
      this.auditoriaRepo.logAction({
        entidad: "paciente",
        operacion: "create",
        registro_id: nuevoPaciente.id || nuevoPaciente._id,
        usuario_id: usuarioId,
        datos_nuevos: nuevoPaciente,
      }).catch((err) => {
        // Error en auditoría (crear paciente)
      });

      return nuevoPaciente;
    } catch (error) {
      throw error;
    }
  }

  async listarPacientes() {
    try {
      return await this.pacienteRepo.findAll();
    } catch (error) {
      throw error;
    }
  }

  async buscarPorId(id) {
    try {
      if (!id) throw new Error("ID del paciente requerido");
      const paciente = await this.pacienteRepo.findById(id);
      if (!paciente) throw new Error("Paciente no encontrado");
      return paciente;
    } catch (error) {
      throw error;
    }
  }

  async actualizarPaciente(id, data, usuarioId) {
    try {
      if (!id) throw new Error("ID del paciente requerido");
      if (!data) throw new Error("Datos de actualización requeridos");

      const anterior = await this.pacienteRepo.findById(id);
      if (!anterior) throw new Error("Paciente no encontrado");

      const actualizado = await this.pacienteRepo.update(id, data);

      // Auditar actualización (no bloquear si falla)
      this.auditoriaRepo.logAction({
        entidad: "paciente",
        operacion: "update",
        registro_id: id,
        usuario_id: usuarioId,
        datos_anteriores: anterior,
        datos_nuevos: actualizado,
      }).catch((err) => {
        // Error en auditoría (actualizar paciente)
      });

      return actualizado;
    } catch (error) {
      throw error;
    }
  }

  async eliminarPaciente(id, usuarioId) {
    try {
      if (!id) throw new Error("ID del paciente requerido");

      const anterior = await this.pacienteRepo.findById(id);
      if (!anterior) throw new Error("Paciente no encontrado");

      await this.pacienteRepo.delete(id);

      // Auditar eliminación (no bloquear si falla)
      this.auditoriaRepo.logAction({
        entidad: "paciente",
        operacion: "delete",
        registro_id: id,
        usuario_id: usuarioId,
        datos_anteriores: anterior,
      }).catch((err) => {
        // Error en auditoría (eliminar paciente)
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PacienteService;
