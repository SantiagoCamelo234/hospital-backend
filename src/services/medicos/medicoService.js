// src/services/medicos/medicoService.js
const Validator = require("../../utils/validator");

class MedicoService {
  constructor(medicoRepo, auditoriaRepo) {
    this.medicoRepo = medicoRepo;
    this.auditoriaRepo = auditoriaRepo;
  }

  async crearMedico(data, usuarioId) {
    try {
      if (!data) throw new Error("Datos del médico requeridos");
      if (
        !Validator.isString(data.nombre) ||
        !Validator.isString(data.especialidad)
      )
        throw new Error("Datos incompletos del médico");

      const nuevo = await this.medicoRepo.create(data);

      // Auditar creación (no bloquear si falla)
      this.auditoriaRepo.logAction({
        entidad: "medico",
        operacion: "create",
        registro_id: nuevo.id || nuevo._id,
        usuario_id: usuarioId,
        datos_nuevos: nuevo,
      }).catch((err) => {
        // Error en auditoría (crear médico)
      });

      return nuevo;
    } catch (error) {
      throw error;
    }
  }

  async listarMedicos() {
    try {
      return await this.medicoRepo.findAll();
    } catch (error) {
      throw error;
    }
  }

  async actualizarMedico(id, data, usuarioId) {
    try {
      if (!id) throw new Error("ID del médico requerido");
      if (!data) throw new Error("Datos de actualización requeridos");

      const anterior = await this.medicoRepo.findById(id);
      if (!anterior) throw new Error("Médico no encontrado");

      const actualizado = await this.medicoRepo.update(id, data);
      
      // Auditar actualización (no bloquear si falla)
      this.auditoriaRepo.logAction({
        entidad: "medico",
        operacion: "update",
        registro_id: id,
        usuario_id: usuarioId,
        datos_anteriores: anterior,
        datos_nuevos: actualizado,
      }).catch((err) => {
        // Error en auditoría (actualizar médico)
      });

      return actualizado;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MedicoService;
