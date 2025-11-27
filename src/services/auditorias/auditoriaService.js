// src/services/auditorias/auditoriaService.js

class AuditoriaService {
  constructor(auditoriaRepo) {
    this.auditoriaRepo = auditoriaRepo;
  }

  async listarTodo() {
    try {
      return await this.auditoriaRepo.getAll();
    } catch (error) {
      throw error;
    }
  }

  async listarPorEntidad(entidad) {
    try {
      if (!entidad) throw new Error("Entidad requerida");
      return await this.auditoriaRepo.getLogsByEntity(entidad);
    } catch (error) {
      throw error;
    }
  }

  async listarPorUsuario(usuarioId) {
    try {
      if (!usuarioId) throw new Error("ID de usuario requerido");
      return await this.auditoriaRepo.getLogsByUser(usuarioId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuditoriaService;
