// Crea un router de Express
const router = require('express').Router();
// Importa controladores de productos
const c = require('../controllers/product.controller');
// Importa middlewares de autenticación y rol
const { authGuard, roleGuard } = require('../middlewares/auth');
const { productUpsertSchema } = require('../schemas/product.schema');
const validate = require('../utils/validate');

// Ruta para listar productos con filtros y paginación
router.get('/', c.list);
// Ruta para obtener producto por id
router.get('/:id', c.getById);

// Rutas protegidas para administración
router.post('/', authGuard, roleGuard('admin'), validate(productUpsertSchema), c.create);
router.put('/:id', authGuard, roleGuard('admin'), validate(productUpsertSchema), c.update);
router.delete('/:id', authGuard, roleGuard('admin'), c.remove);
router.patch('/:id/sizes', authGuard, roleGuard('admin'), c.upsertSizeStock);



// Exporta el router
module.exports = router;
