// src/services/pacientes/pacienteFunctionalService.js
const { pipe, assoc, safe } = require("../../utils/fp");
const Validator = require("../../utils/validator");

module.exports = (repo) => {
  const normalizePaciente = (data) => ({
    nombre: data.nombre.trim(),
    apellido: data.apellido.trim(),
    email: data.email.toLowerCase(),
    telefono: data.telefono || null,
    fecha_nacimiento: data.fecha_nacimiento || null,
  });

  const validar = (paciente) => {
    if (!Validator.isEmail(paciente.email)) throw new Error("Email inválido");
    if (!Validator.isString(paciente.nombre))
      throw new Error("Nombre obligatorio");
    return paciente;
  };

  const crearPaciente = async (data) => {
    const paciente = pipe(normalizePaciente, validar)(data);
    return await repo.create(paciente);
  };

  const buscarPorNombre = async (nombre) => {
    return await repo.searchByName(nombre);
  };

  const listarConcurrentemente = async (nombres) => {
    const consultas = nombres.map((n) => repo.searchByName(n));
    const resultados = await Promise.all(consultas);
    return resultados.flat();
  };

  return {
    crearPaciente: safe(crearPaciente),
    buscarPorNombre,
    listarConcurrentemente,
  };
};
