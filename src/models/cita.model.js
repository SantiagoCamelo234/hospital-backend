// src/models/cita.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const CitaSchema = new Schema({
  paciente_id: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
  medico_id: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  motivo: { type: String },
  estado: {
    type: String,
    enum: ["pendiente", "confirmada", "cancelada", "realizada"],
    default: "pendiente",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});

module.exports = mongoose.model("Cita", CitaSchema);
