// src/middlewares/errorHandler.js


function errorHandler(err, req, res, next) {

  // Determinar código de estado y mensaje según el tipo de error
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Error interno del servidor. Intenta más tarde.";
  
  // Si es un error de validación o datos, usar 400
  if (message.includes("requerido") || message.includes("inválido") || message.includes("incompleto")) {
    statusCode = 400;
  }

  // Manejo de errores de base de datos
  if (err.code === 11000) {
    statusCode = 409;
    message = "El registro ya existe en la base de datos.";
  } else if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") {
    statusCode = 503;
    message = "Error de conexión con la base de datos. Intenta más tarde.";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = `Error de validación: ${err.message}`;
  } else if (err.name === "CastError" || err.name === "ObjectId") {
    statusCode = 400;
    message = "ID inválido o formato incorrecto.";
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token inválido o expirado.";
  } else if (err.name === "MongoError" || err.name === "MongooseError") {
    statusCode = 500;
    message = "Error en la base de datos MongoDB.";
  }

  // Respuesta al cliente
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { 
      stack: err.stack,
      error: err.name,
      code: err.code 
    }),
  };

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
