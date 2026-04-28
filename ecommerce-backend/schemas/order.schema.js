// schemas/order.schema.js
const Joi = require('joi');

const itemSchema = Joi.object({
  product: Joi.string().required(),         
  qty: Joi.number().integer().min(1).required(),
  size: Joi.string().allow('', null),
});

exports.createOrderSchema = Joi.object({
  items: Joi.array().items(itemSchema).min(1).required(),
  shippingAddress: Joi.object({
    line1: Joi.string().required(),
    line2: Joi.string().allow(''),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  idempotencyKey: Joi.string().max(100).allow('', null),
});

exports.payOrderSchema = Joi.object({
  provider: Joi.string().valid('mock', 'stripe').default('mock'),
  reference: Joi.string().max(200).allow('', null),
});
