// src/repositories/consultas/mongoConsultaRepo.js
const Consulta = require("../../models/consulta.model");

class MongoConsultaRepo {
  async create(data) {
    try {
      return await Consulta.create(data);
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Consulta.findById(id)
        .populate("medico_id paciente_id cita_id")
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await Consulta.find()
        .populate("medico_id paciente_id cita_id")
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async update(id, updates) {
    try {
      updates.updated_at = new Date();
      return await Consulta.findByIdAndUpdate(id, updates, { new: true }).lean();
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Consulta.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async findByPaciente(pacienteId) {
    try {
      return await Consulta.find({ paciente_id: pacienteId })
        .populate("medico_id cita_id")
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async findByMedico(medicoId) {
    try {
      return await Consulta.find({ medico_id: medicoId })
        .populate("paciente_id cita_id")
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async findByCitaId(citaId) {
    try {
      return await Consulta.find({ cita_id: citaId })
        .populate("medico_id paciente_id")
        .lean();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MongoConsultaRepo;
