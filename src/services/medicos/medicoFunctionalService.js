// src/services/medicos/medicoFunctionalService.js
const { pipe, safe } = require("../../utils/fp");
const Validator = require("../../utils/validator");

module.exports = (medicoRepo) => {
  const normalizar = (data) => ({
    nombre: data.nombre.trim(),
    apellido: data.apellido.trim(),
    especialidad: data.especialidad.trim(),
    telefono: data.telefono || "",
    email: data.email.toLowerCase(),
    licencia_medica: data.licencia_medica.trim(),
  });

  const validar = (medico) => {
    if (!Validator.isEmail(medico.email)) throw new Error("Email inválido");
    if (!Validator.isString(medico.especialidad))
      throw new Error("Especialidad requerida");
    return medico;
  };

  const crearMedico = async (data) => {
    const medico = pipe(normalizar, validar)(data);
    return await medicoRepo.create(medico);
  };

  const buscarPorEspecialidad = async (esp) =>
    await medicoRepo.searchBySpecialty(esp);

  return {
    crearMedico: safe(crearMedico),
    buscarPorEspecialidad,
  };
};
