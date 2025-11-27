// src/repositories/pacientes/mongoPacienteRepo.js
const Paciente = require("../../models/paciente.model");

class MongoPacienteRepo {
  async create(data) {
    try {
      return await Paciente.create(data);
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Paciente.findById(id).lean();
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await Paciente.find({ activo: true }).lean();
    } catch (error) {
      throw error;
    }
  }

  async update(id, updates) {
    try {
      updates.updated_at = new Date();
      return await Paciente.findByIdAndUpdate(id, updates, { new: true }).lean();
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Paciente.findByIdAndUpdate(id, { activo: false });
    } catch (error) {
      throw error;
    }
  }

  async searchByName(query) {
    try {
      return await Paciente.find({
        nombre: new RegExp(query, "i"),
        activo: true,
      }).lean();
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      return await Paciente.findOne({ email: email.toLowerCase(), activo: true }).lean();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MongoPacienteRepo;
