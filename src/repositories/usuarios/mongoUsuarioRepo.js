// src/repositories/usuarios/mongoUsuarioRepo.js
const bcrypt = require("bcryptjs");
const Usuario = require("../../models/usuario.model");

class MongoUsuarioRepo {
  async create(data) {
    try {
      const password_hash = await bcrypt.hash(data.password, 10);
      return await Usuario.create({
        nombre_usuario: data.nombre_usuario,
        email: data.email,
        password_hash,
        rol: data.rol || "paciente",
        activo: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Usuario.findById(id).lean();
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      return await Usuario.findOne({ email }).lean();
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await Usuario.find({ activo: true }).lean();
    } catch (error) {
      throw error;
    }
  }

  async update(id, updates) {
    try {
      if (updates.password) {
        updates.password_hash = await bcrypt.hash(updates.password, 10);
        delete updates.password;
      }
      updates.updated_at = new Date();
      return await Usuario.findByIdAndUpdate(id, updates, { new: true }).lean();
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Usuario.findByIdAndUpdate(id, { activo: false });
    } catch (error) {
      throw error;
    }
  }

  async verifyCredentials(email, password) {
    try {
      const user = await Usuario.findOne({ email });
      if (!user) return null;
      const valid = await bcrypt.compare(password, user.password_hash);
      return valid ? user : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MongoUsuarioRepo;
