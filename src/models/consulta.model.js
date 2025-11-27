// src/models/consulta.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConsultaSchema = new Schema({
  cita_id: { type: Schema.Types.ObjectId, ref: "Cita", required: true },
  diagnostico: { type: String },
  tratamiento: { type: String },
  observaciones: { type: String },
  fecha_consulta: { type: Date, default: Date.now },
  medico_id: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
  paciente_id: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
});

module.exports = mongoose.model("Consulta", ConsultaSchema);
