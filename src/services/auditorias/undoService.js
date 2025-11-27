// src/services/auditoria/undoService.js
class UndoService {
  constructor(auditoriaRepo, repos) {
    this.auditoriaRepo = auditoriaRepo;
    this.repos = repos; // { pacienteRepo, medicoRepo, ... }
  }

  async deshacerUltimaAccion(entidad) {
    const logs = await this.auditoriaRepo.getLogsByEntity(entidad);
    const ultimo = logs[0];
    if (!ultimo) throw new Error("No hay acciones para deshacer");

    const repo = this.repos[`${entidad}Repo`];
    if (!repo) throw new Error(`No existe repositorio para ${entidad}`);

    if (ultimo.operacion === "create") {
      await repo.delete(ultimo.registro_id);
    } else if (ultimo.operacion === "update") {
      await repo.update(ultimo.registro_id, ultimo.datos_anteriores);
    } else if (ultimo.operacion === "delete") {
      await repo.create(ultimo.datos_anteriores);
    }

    await this.auditoriaRepo.logAction({
      entidad,
      operacion: "undo",
      registro_id: ultimo.registro_id,
      datos_nuevos: ultimo.datos_anteriores,
    });

    return { success: true, undone: ultimo };
  }
}

module.exports = UndoService;
