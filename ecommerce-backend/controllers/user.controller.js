// controller/user.controller.js
const User = require('../models/User');

/** Util para extraer el ID del token (sub | id | _id) */
function getUserIdFromReq(req) {
  return req.user?.sub || req.user?.id || req.user?._id || req.userId || null;
}

/** GET /api/users/me */
exports.getMe = async (req, res, next) => {
  try {
    const uid = getUserIdFromReq(req);
    if (!uid) return res.status(401).json({ message: 'Invalid token payload' });

    const user = await User.findById(uid).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) { next(err); }
};

/** PUT /api/users/me */
exports.updateMe = async (req, res, next) => {
  try {
    const uid = getUserIdFromReq(req);
    if (!uid) return res.status(401).json({ message: 'Invalid token payload' });

    const user = await User.findById(uid);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name  = req.body.name  ?? user.name;
    user.email = req.body.email ?? user.email;
    if (req.body.password) user.password = req.body.password;

    const saved = await user.save();
    res.json({ _id: saved._id, name: saved.name, email: saved.email, role: saved.role });
  } catch (err) { next(err); }
};

/** PUT /api/users/change-password  */
exports.changeMyPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const uid = getUserIdFromReq(req);
    if (!uid) return res.status(401).json({ message: 'Invalid token payload' });

    const user = await User.findById(uid);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await user.matchPassword(oldPassword);
    if (!ok) return res.status(400).json({ message: 'Old password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) { next(err); }
};

/** GET /api/users  (admin) */
exports.listUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { next(err); }
};

/** GET /api/users/:id  (admin) */
exports.getUserById = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).select('-password');
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json(u);
  } catch (err) { next(err); }
};

/** PUT /api/users/:id  (admin) */
exports.updateUserById = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });

    u.name  = req.body.name  ?? u.name;
    u.email = req.body.email ?? u.email;
    if (req.body.password) u.password = req.body.password;
    if (typeof req.body.role === 'string') u.role = req.body.role;

    const saved = await u.save();
    res.json({ _id: saved._id, name: saved.name, email: saved.email, role: saved.role });
  } catch (err) { next(err); }
};

/** DELETE /api/users/:id  (admin) */
exports.deleteUserById = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    await u.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
};
