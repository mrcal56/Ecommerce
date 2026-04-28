// Clase de error personalizada para enviar estado y mensaje
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Envoltorio para controladores async que captura y pasa errores a next
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Middleware para responder 404 en prefijo /api
function notFound(req, res, next) {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
}

// Middleware centralizado de manejo de errores
function errorHandler(err, req, res, next) {
  // Determina el código de estado
  const status = err.status || 500;
  // Determina el mensaje seguro para el cliente
  const msg = err.message || 'Internal Server Error';
  // Loguea el error si no estás en producción
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERR]', err);
  }
  // Responde con JSON estandarizado
  res.status(status).json({ error: msg });
}

// Exporta utilidades
module.exports = { ApiError, asyncHandler, notFound, errorHandler };
