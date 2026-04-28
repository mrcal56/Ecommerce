// controllers/paymentMp.controller.js
const axios = require('axios');
const Order = require('../models/Order');
const { asyncHandler, ApiError } = require('../middlewares/error');

// URL base del frontend (para back_urls)
const FRONT_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Verificación básica de que exista el token de MP
const MP_TOKEN = process.env.MP_ACCESS_TOKEN;
if (!MP_TOKEN) {
  console.warn('[WARN] MP_ACCESS_TOKEN no está definido en .env');
}

// Cliente axios para Mercado Pago
const mpClient = axios.create({
  baseURL: 'https://api.mercadopago.com',
  headers: {
    Authorization: `Bearer ${MP_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// POST /api/payments/mercadopago/preference
exports.createPreference = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) throw new ApiError(400, 'Missing orderId');

  const order = await Order.findById(orderId).lean();
  if (!order) throw new ApiError(404, 'Order not found');

  // Mapear items de la orden al formato de MP
  const items = (order.items || []).map((it) => ({
    title: it.name + (it.size ? ` (Talla ${it.size})` : ''),
    quantity: it.qty,
    unit_price: Number(it.price),
    currency_id: 'MXN',
  }));

  if (!items.length) {
    throw new ApiError(400, 'Order has no items');
  }

  const preferenceBody = {
    items,
    external_reference: order._id.toString(),
    back_urls: {
      success: `${FRONT_URL}/order-success?orderId=${order._id}`,
      failure: `${FRONT_URL}/cart?payment=failure`,
      pending: `${FRONT_URL}/payment-status?orderId=${order._id}`,
    },
    // En localhost / pruebas es más seguro NO usar auto_return
    // Si quieres activarlo en producción, puedes controlar con una env:
    // auto_return: 'approved',
  };

  try {
    const mpRes = await mpClient.post('/checkout/preferences', preferenceBody);

    return res.status(201).json({
      init_point: mpRes.data.init_point,
      sandbox_init_point: mpRes.data.sandbox_init_point,
    });
  } catch (err) {
    console.error('[MP ERROR]', err.response?.data || err.message);

    const status = err.response?.status || 500;
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Error comunicando con Mercado Pago';

    throw new ApiError(status, msg);
  }
});
