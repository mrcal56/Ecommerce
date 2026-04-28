// Carga el modelo de usuarios
const User = require('../models/User');
// Carga utilidades de error y async
const { asyncHandler, ApiError } = require('../middlewares/error');
// Carga utilidades JWT para firmar tokens
const { signAccess, signRefresh } = require('../middlewares/auth');

// Controlador de registro de usuarios
exports.register = asyncHandler(async (req, res) => {
  // Extrae campos requeridos del body
  const { name, email, password } = req.body;
  // Valida presencia de campos
  if (!name || !email || !password) throw new ApiError(400, 'Missing fields');
  // Verifica si el email ya existe
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already registered');
  // Crea el usuario desencadenando el hash pre-save
  const user = await User.create({ name, email, password });
  // Responde con datos mínimos no sensibles
  res.status(201).json({ id: user._id, email: user.email });
});

// Controlador de login
exports.login = asyncHandler(async (req, res) => {
  // Extrae credenciales del body
  const { email, password } = req.body;
  // Busca el usuario por email
  const user = await User.findOne({ email });
  // Valida existencia de usuario y contraseña
  if (!user || !(await user.compare(password))) throw new ApiError(401, 'Invalid credentials');
  // Prepara payload del token con identificador y rol
  const payload = { sub: user._id.toString(), role: user.role, email: user.email };
  // Devuelve par de tokens para autenticación y refresh
  res.json({ accessToken: signAccess(payload), refreshToken: signRefresh(payload) });
});

// Controlador de refresh de access token
exports.refresh = asyncHandler(async (req, res) => {
  // Carga JWT para verificar el refresh
  const jwt = require('jsonwebtoken');
  // Extrae token de refresh del body
  const { token } = req.body;
  // Valida presencia de token
  if (!token) throw new ApiError(400, 'Missing refresh token');
  // Verifica token con la clave de refresh
  const data = jwt.verify(token, process.env.REFRESH_SECRET);
  // Construye payload del nuevo access token
  const payload = { sub: data.sub, role: data.role, email: data.email };
  // Devuelve nuevo access token
  res.json({ accessToken: signAccess(payload) });
});
