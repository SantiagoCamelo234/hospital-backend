// src/models/usuario.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsuarioSchema = new Schema({
  nombre_usuario: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password_hash: { type: String, required: true },
  rol: {
    type: String,
    enum: ["admin", "medico", "paciente"],
    default: "paciente",
  },
  activo: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
