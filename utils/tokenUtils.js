// src/utils/tokenUtils.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || "1d";

/**
 * Crea un token JWT
 * @param {Object} payload - datos que contendrá el token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
};

/**
 * Verifica un token JWT
 * @param {string} token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Token inválido o expirado");
  }
};

/**
 * Refresca un token JWT existente
 * @param {string} token
 */
const refreshToken = (token) => {
  const decoded = verifyToken(token);
  delete decoded.iat;
  delete decoded.exp;
  return generateToken(decoded);
};

module.exports = { generateToken, verifyToken, refreshToken };
