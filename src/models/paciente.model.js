// src/models/paciente.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const PacienteSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  telefono: { type: String },
  fecha_nacimiento: { type: Date },
  direccion: { type: String },
  activo: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});

module.exports = mongoose.model("Paciente", PacienteSchema);
