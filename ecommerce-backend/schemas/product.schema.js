const Joi = require('joi');

const sizeSchema = Joi.object({
  size: Joi.string().trim().min(1).required(),
  stock: Joi.number().integer().min(0).required(),
});

exports.productUpsertSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  description: Joi.string().allow('').max(2000),
  price: Joi.number().precision(2).min(0).required(),
  imageUrl: Joi.string().uri().allow(''),
  sizes: Joi.array().items(sizeSchema).default([]),
});

