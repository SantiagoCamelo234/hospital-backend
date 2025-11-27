// src/repositories/auditoria/mongoAuditoriaRepo.js
const mongoose = require("mongoose");
const Auditoria = require("../../models/auditoria.model");

class MongoAuditoriaRepo {
  async logAction(data) {
    try {
      // Convertir registro_id a string si es necesario
      const registroId = data.registro_id ? String(data.registro_id) : null;
      
      // Manejar usuario_id: debe ser ObjectId (MongoDB)
      let usuarioId = null;
      if (data.usuario_id) {
        // Si es un ObjectId válido, convertir a ObjectId
        if (mongoose.Types.ObjectId.isValid(data.usuario_id) && 
            String(data.usuario_id).length === 24) {
          usuarioId = new mongoose.Types.ObjectId(data.usuario_id);
        } else {
          // Si no es un ObjectId válido, almacenarlo como string
          usuarioId = String(data.usuario_id);
        }
      }

      return await Auditoria.create({
        entidad: data.entidad,
        operacion: data.operacion,
        registro_id: registroId,
        usuario_id: usuarioId,
        datos_anteriores: data.datos_anteriores,
        datos_nuevos: data.datos_nuevos,
        timestamp: new Date(),
      });
    } catch (error) {
      // No lanzar error en auditoría para no bloquear operaciones principales
      // Continuar sin fallar la operación principal
    }
  }

  async getLogsByEntity(entidad) {
    try {
      return await Auditoria.find({ entidad }).sort({ timestamp: -1 }).lean();
    } catch (error) {
      throw error;
    }
  }

  async getLogsByUser(usuario_id) {
    try {
      return await Auditoria.find({ usuario_id }).sort({ timestamp: -1 }).lean();
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      return await Auditoria.find().sort({ timestamp: -1 }).lean();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MongoAuditoriaRepo;
