// src/models/medico.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const MedicoSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  especialidad: { type: String, required: true },
  telefono: { type: String },
  email: { type: String, unique: true, lowercase: true },
  licencia_medica: { type: String, required: true },
  activo: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});

module.exports = mongoose.model("Medico", MedicoSchema);
