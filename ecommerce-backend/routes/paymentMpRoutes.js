const router = require('express').Router();
const { authGuard } = require('../middlewares/auth');
const { createPreference } = require('../controllers/paymentMp.controller');

// Crear preferencia de Mercado Pago para una orden
router.post('/mercadopago/preference', authGuard, createPreference);

module.exports = router;