// src/middlewares/roleMiddleware.js

/**
 * Middleware que valida si el usuario autenticado tiene un rol permitido
 * @param {...string|Array} allowedRoles - roles permitidos (puede ser array o argumentos separados)
 */
function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    // Si el primer argumento es un array, usarlo directamente; si no, usar todos los argumentos
    const roles = Array.isArray(allowedRoles[0]) ? allowedRoles[0] : allowedRoles;
    
    // El token puede tener 'role' o 'rol'
    const userRole = req.user.role || req.user.rol;

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: "Rol de usuario no encontrado",
      });
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Rol '${userRole}' no autorizado.`,
      });
    }

    next();
  };
}

module.exports = roleMiddleware;
