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

// =============================
// POST /api/payments/mercadopago/preference
// Crea una preferencia de pago en MP y devuelve el link
// =============================
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
    notification_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/mercadopago/webhook`,
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

// =============================
// POST /api/payments/mercadopago/webhook
// Recibe notificaciones de MP y actualiza el estado de la orden
//
// IMPORTANTE — configurar en MP Dashboard:
// Notificaciones → URL: https://tu-dominio.com/api/payments/mercadopago/webhook
// Eventos: payments
// =============================
exports.webhook = async (req, res) => {
  // Siempre responder 200 primero — si tardamos MP puede reenviar la notificación
  res.sendStatus(200);

  try {
    const { type, data } = req.body;

    // MP notifica varios tipos de eventos, solo nos interesan los pagos
    if (type !== 'payment') return;

    const paymentId = data?.id;
    if (!paymentId) return;

    // Consultar el pago directamente a MP — nunca confiar solo en el body del webhook
    // (cualquiera podría hacer un POST falso a esta ruta)
    const mpRes = await mpClient.get(`/v1/payments/${paymentId}`);
    const payment = mpRes.data;

    // external_reference contiene el orderId que pusimos al crear la preferencia
    const orderId = payment.external_reference;
    if (!orderId) return;

    const order = await Order.findById(orderId);
    if (!order) return;

    // Solo actualizar si el pago fue aprobado y la orden no está ya pagada
    if (payment.status === 'approved' && order.status !== 'paid') {
      order.status = 'paid';
      order.payment = {
        ...(order.payment || {}),
        provider: 'mercadopago',
        status: 'paid',
        reference: String(paymentId),
        paidAt: new Date(),
      };
      await order.save();
      console.log(`[MP WEBHOOK] Orden ${orderId} marcada como pagada`);
    }

  } catch (err) {
    // Log del error pero NO relanzar — ya respondimos 200
    console.error('[MP WEBHOOK ERROR]', err.message);
  }
};