// src/services/usuarios/usuarioService.js
const Validator = require("../../utils/validator");

class UsuarioService {
  constructor(usuarioRepo, auditoriaRepo) {
    this.usuarioRepo = usuarioRepo;
    this.auditoriaRepo = auditoriaRepo;
  }

  async listarUsuarios() {
    try {
      return await this.usuarioRepo.findAll();
    } catch (error) {
      throw error;
    }
  }

  async obtenerUsuario(id) {
    try {
      if (!id) throw new Error("ID del usuario requerido");
      const user = await this.usuarioRepo.findById(id);
      if (!user) throw new Error("Usuario no encontrado");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async actualizarUsuario(id, data, usuarioId) {
    try {
      if (!id) throw new Error("ID del usuario requerido");
      if (!data) throw new Error("Datos de actualización requeridos");

      const anterior = await this.usuarioRepo.findById(id);
      if (!anterior) throw new Error("Usuario no encontrado");

      if (data.email && !Validator.isEmail(data.email))
        throw new Error("Correo inválido");

      const actualizado = await this.usuarioRepo.update(id, data);

      // Auditar actualización (no bloquear si falla)
      this.auditoriaRepo.logAction({
        entidad: "usuario",
        operacion: "update",
        registro_id: id,
        usuario_id: usuarioId,
        datos_anteriores: anterior,
        datos_nuevos: actualizado,
      }).catch((err) => {
        // Error en auditoría (actualizar usuario)
      });

      return actualizado;
    } catch (error) {
      throw error;
    }
  }

  async eliminarUsuario(id, usuarioId) {
    try {
      if (!id) throw new Error("ID del usuario requerido");

      const anterior = await this.usuarioRepo.findById(id);
      if (!anterior) throw new Error("Usuario no encontrado");

      await this.usuarioRepo.delete(id);

      // Auditar eliminación (no bloquear si falla)
      this.auditoriaRepo.logAction({
        entidad: "usuario",
        operacion: "delete",
        registro_id: id,
        usuario_id: usuarioId,
        datos_anteriores: anterior,
      }).catch((err) => {
        // Error en auditoría (eliminar usuario)
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UsuarioService;
