// src/models/auditoria.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Modelo para registrar todas las acciones CRUD del sistema
 * Permite implementar un sistema de auditoría y "undo"
 */
const AuditoriaSchema = new Schema({
  entidad: { type: String, required: true },
  operacion: {
    type: String,
    enum: ["create", "update", "delete"],
    required: true,
  },
  registro_id: { type: String, required: true },
  // usuario_id puede ser ObjectId (MongoDB) o String
  usuario_id: { 
    type: Schema.Types.Mixed, 
    ref: "Usuario",
    // Permitir null, ObjectId, o String
  },
  datos_anteriores: { type: Schema.Types.Mixed },
  datos_nuevos: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Auditoria", AuditoriaSchema);
