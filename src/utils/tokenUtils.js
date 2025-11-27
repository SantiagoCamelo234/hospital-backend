// src/utils/tokenUtils.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Crea un token JWT
 * @param {Object} payload - datos que contendrá el token
 */
const generateToken = (payload) => {
  try {
    if (!payload) throw new Error("Payload requerido para generar token");
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    throw new Error("Error al generar token de autenticación");
  }
};

/**
 * Verifica un token JWT
 * @param {string} token
 */
const verifyToken = (token) => {
  try {
    if (!token) throw new Error("Token requerido");
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Token expirado");
    } else if (err.name === "JsonWebTokenError") {
      throw new Error("Token inválido");
    }
    throw new Error("Token inválido o expirado");
  }
};

/**
 * Refresca un token JWT existente
 * @param {string} token
 */
const refreshToken = (token) => {
  try {
    if (!token) throw new Error("Token requerido para refrescar");
    const decoded = verifyToken(token);
    delete decoded.iat;
    delete decoded.exp;
    return generateToken(decoded);
  } catch (error) {
    throw error;
  }
};

module.exports = { generateToken, verifyToken, refreshToken };



