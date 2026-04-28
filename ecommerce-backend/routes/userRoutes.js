// routes/userRoutes.js
const router = require('express').Router();
const { authGuard, roleGuard } = require('../middlewares/auth'); // o ../utils/auth si ahí lo tienes
const validate = require('../utils/validate');
const c = require('../controllers/user.controller');
const { updateMeSchema, changePasswordSchema } = require('../schemas/user.schema');
    

// Perfil propio
router.get('/me', authGuard, c.getMe);
router.put('/me', authGuard, validate(updateMeSchema), c.updateMe);
router.put('/change-password', authGuard, validate(changePasswordSchema), c.changeMyPassword);

// Admin
router.get('/',     authGuard, roleGuard('admin'), c.listUsers);
router.get('/:id',  authGuard, roleGuard('admin'), c.getUserById);
router.put('/:id',  authGuard, roleGuard('admin'), c.updateUserById);
router.delete('/:id', authGuard, roleGuard('admin'), c.deleteUserById);

module.exports = router;
