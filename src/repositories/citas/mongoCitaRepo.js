// src/repositories/citas/mongoCitaRepo.js
const Cita = require("../../models/cita.model");

class MongoCitaRepo {
  async create(data) {
    try {
      return await Cita.create(data);
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Cita.findById(id).populate("paciente_id medico_id").lean();
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await Cita.find().populate("paciente_id medico_id").lean();
    } catch (error) {
      throw error;
    }
  }

  async update(id, updates) {
    try {
      updates.updated_at = new Date();
      return await Cita.findByIdAndUpdate(id, updates, { new: true }).lean();
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Cita.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async findByPaciente(pacienteId) {
    try {
      return await Cita.find({ paciente_id: pacienteId })
        .populate("medico_id")
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async findByMedico(medicoId) {
    try {
      return await Cita.find({ medico_id: medicoId })
        .populate("paciente_id")
        .lean();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MongoCitaRepo;
