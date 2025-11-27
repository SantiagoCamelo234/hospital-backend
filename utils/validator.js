// src/utils/validator.js
const dayjs = require("dayjs");

/**
 * Valida formatos y tipos básicos de datos
 */
const Validator = {
  isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isPhone: (phone) => /^\+?\d{7,15}$/.test(phone),
  isDate: (date) => dayjs(date, ["YYYY-MM-DD", "DD-MM-YYYY"], true).isValid(),
  isString: (value) => typeof value === "string" && value.trim().length > 0,
  isNumber: (value) => typeof value === "number" && !isNaN(value),
  isObject: (value) => typeof value === "object" && value !== null,
  isPositive: (value) => typeof value === "number" && value > 0,
  hasLengthBetween: (str, min, max) => str.length >= min && str.length <= max,
  notEmpty: (val) => val !== null && val !== undefined && val !== "",
  isValidPassword: (pwd) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(pwd), // mínimo 8, 1 mayus, 1 minus, 1 número
};

module.exports = Validator;
