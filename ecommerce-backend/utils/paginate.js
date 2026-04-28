// Calcula paginación segura a partir de query params
module.exports = function paginate(q, { page = 1, limit = 12 } = {}) {
  // Normaliza página a entero mínimo 1
  page = Math.max(1, Number(page));
  // Limita tamaño de página a un máximo razonable
  limit = Math.min(100, Math.max(1, Number(limit)));
  // Calcula desplazamiento
  const skip = (page - 1) * limit;
  // Devuelve parámetros de paginación
  return { skip, limit, page };
};
