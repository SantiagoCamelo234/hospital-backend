// src/services/citas/citaFunctionalService.js
const { pipe, safe } = require("../../utils/fp");
const Validator = require("../../utils/validator");

module.exports = (citaRepo) => {
  const normalizar = (data) => ({
    paciente_id: data.paciente_id,
    medico_id: data.medico_id,
    fecha: new Date(data.fecha),
    hora: data.hora.trim(),
    motivo: data.motivo?.trim() || "",
    estado: data.estado || "pendiente",
  });

  const validar = (cita) => {
    if (!Validator.isString(cita.hora)) throw new Error("Hora inválida");
    if (!cita.paciente_id || !cita.medico_id)
      throw new Error("Paciente y médico requeridos");
    return cita;
  };

  const crearCita = async (data) => {
    const cita = pipe(normalizar, validar)(data);
    return await citaRepo.create(cita);
  };

  const buscarPorPaciente = async (id) => await citaRepo.findByPaciente(id);

  return {
    crearCita: safe(crearCita),
    buscarPorPaciente,
  };
};
