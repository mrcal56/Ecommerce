const Joi = require('joi');

exports.updateMeSchema = Joi.object({
  name: Joi.string().min(2).max(80),
  email: Joi.string().email(),
  password: Joi.string().min(8),
});

exports.changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});
