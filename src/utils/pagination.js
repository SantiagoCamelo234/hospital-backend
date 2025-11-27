// src/utils/pagination.js

/**
 * Calcula límites y offsets para paginación
 * @param {Object} queryParams - contiene page, limit, orderBy, order
 */
function getPaginationParams(queryParams = {}) {
  const page = Math.max(parseInt(queryParams.page) || 1, 1);
  const limit = Math.max(parseInt(queryParams.limit) || 10, 1);
  const offset = (page - 1) * limit;

  const orderBy = queryParams.orderBy || "id";
  const order = queryParams.order === "desc" ? "desc" : "asc";

  return { page, limit, offset, orderBy, order };
}

/**
 * Devuelve la respuesta paginada
 */
function buildPaginatedResponse(data, page, limit, total) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

module.exports = { getPaginationParams, buildPaginatedResponse };







