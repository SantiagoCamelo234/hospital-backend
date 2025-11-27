// src/repositories/medicos/mongoMedicoRepo.js
const Medico = require("../../models/medico.model");

class MongoMedicoRepo {
  async create(data) {
    try {
      return await Medico.create(data);
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Medico.findById(id).lean();
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await Medico.find({ activo: true }).lean();
    } catch (error) {
      throw error;
    }
  }

  async update(id, updates) {
    try {
      updates.updated_at = new Date();
      return await Medico.findByIdAndUpdate(id, updates, { new: true }).lean();
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Medico.findByIdAndUpdate(id, { activo: false });
    } catch (error) {
      throw error;
    }
  }

  async searchBySpecialty(especialidad) {
    try {
      return await Medico.find({
        especialidad: new RegExp(especialidad, "i"),
        activo: true,
      }).lean();
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      return await Medico.findOne({ email: email.toLowerCase(), activo: true }).lean();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MongoMedicoRepo;
