// Crea un router de Express
const router = require('express').Router();
// Importa controladores de autenticación
const c = require('../controllers/auth.controller');

// Ruta para registrar usuarios
router.post('/register', c.register);
// Ruta para iniciar sesión
router.post('/login', c.login);
// Ruta para renovar access token con refresh token
router.post('/refresh', c.refresh);

// Exporta el router
module.exports = router;
