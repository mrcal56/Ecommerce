// Carga JWT para firmar/verificar tokens
const jwt = require('jsonwebtoken');
// Carga error personalizado
const { ApiError } = require('./error');

// Firma un access token con expiración corta
function signAccess(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30m' });
}

// Firma un refresh token con expiración más larga
function signRefresh(payload) {
  return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN || '7d' });
}

// Middleware que protege rutas verificando el Bearer token
function authGuard(req, res, next) {
  // Lee el header Authorization
  const h = req.headers.authorization || '';
  // Extrae token con formato Bearer
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  // Si no hay token, responde 401
  if (!token) return next(new ApiError(401, 'Missing token'));
  try {
    // Verifica y decodifica el token
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    // Continúa al siguiente middleware
    next();
  } catch (e) {
    // Responde 401 si el token es inválido o expiró
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

// Middleware de control de rol para rutas de administrador
function roleGuard(...roles) {
  // Devuelve un middleware que verifica que el usuario tenga uno de los roles requeridos
  return (req, res, next) => {
    // Si no hay usuario o su rol no coincide, responde 403
    if (!req.user || !roles.includes(req.user.role)) return next(new ApiError(403, 'Forbidden'));
    // Si pasa la verificación, continúa
    next();
  };
}

module.exports = { signAccess, signRefresh, authGuard, roleGuard };
