const router = require('express').Router();
const { authGuard, roleGuard } = require('../middlewares/auth'); 
const c = require('../controllers/order.controller');
const validate = require('../utils/validate');
const { createOrderSchema, payOrderSchema } = require('../schemas/order.schema');

// Crear orden (usuario autenticado)
router.post(
  '/',
  authGuard,
  validate(createOrderSchema),
  c.create
);

// Mis órdenes
router.get(
  '/mine',
  authGuard,
  c.mine
);

// Ver una orden por id (dueño o admin)
router.get(
  '/:id',
  authGuard,
  c.getById
);

// Pagar una orden (simulado)
router.post(
  '/:id/pay',
  authGuard,
  validate(payOrderSchema),
  c.pay
);

// (Opcional) admin: listar todas las órdenes
// router.get('/', authGuard, roleGuard('admin'), c.listAll);

module.exports = router;
