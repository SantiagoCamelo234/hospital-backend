// src/services/consultas/consultaFunctionalService.js
const { pipe, safe } = require("../../utils/fp");
const Validator = require("../../utils/validator");

module.exports = (consultaRepo) => {
  const normalizar = (data) => ({
    cita_id: data.cita_id,
    paciente_id: data.paciente_id,
    medico_id: data.medico_id,
    diagnostico: data.diagnostico?.trim() || "",
    tratamiento: data.tratamiento?.trim() || "",
    observaciones: data.observaciones?.trim() || "",
    fecha_consulta: new Date(data.fecha_consulta || Date.now()),
  });

  const validar = (consulta) => {
    if (!consulta.cita_id) throw new Error("Consulta sin cita asociada");
    if (!consulta.medico_id || !consulta.paciente_id)
      throw new Error("Consulta debe tener médico y paciente");
    return consulta;
  };

  const crearConsulta = async (data) => {
    const consulta = pipe(normalizar, validar)(data);
    return await consultaRepo.create(consulta);
  };

  return { crearConsulta: safe(crearConsulta) };
};
