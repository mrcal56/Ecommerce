const Order = require('../models/Order');
const Product = require('../models/Product');
const { asyncHandler, ApiError } = require('../middlewares/error');

function getUserId(req) {
  return req.user?.sub || req.user?.id || req.user?._id || req.userId || null;
}

// =============================
// POST /api/orders
// Crea una orden a partir del carrito
// =============================
exports.create = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) throw new ApiError(401, 'Invalid token payload');

  const { items = [], shippingAddress = {}, idempotencyKey } = req.body;

  if (!items.length) {
    throw new ApiError(400, 'Empty cart');
  }

  if (idempotencyKey) {
    const existing = await Order.findOne({
      'payment.idempotencyKey': idempotencyKey,
      user: userId,
    });
    if (existing) {
      return res.status(200).json(existing);
    }
  }

  let subtotal = 0;
  const toSave = [];

  for (const it of items) {
    const prod = await Product.findById(it.product);

    if (!prod) {
      throw new ApiError(400, `Product not found: ${it.product}`);
    }

    const unitPrice = prod.price;

    // Validar stock disponible (sin descontar todavía — eso ocurre al pagar)
    if (Array.isArray(prod.sizes) && prod.sizes.length > 0 && it.size) {
      const sizeEntry = prod.sizes.find((s) => s.size === it.size);
      if (!sizeEntry) {
        throw new ApiError(409, `Size ${it.size} not available for ${prod.name}`);
      }
      if (sizeEntry.stock < it.qty) {
        throw new ApiError(409, `Not enough stock for ${prod.name} - size ${it.size}`);
      }
    } else if (typeof prod.stock === 'number') {
      if (prod.stock < it.qty) {
        throw new ApiError(409, `Not enough stock for ${prod.name}`);
      }
    }

    subtotal += unitPrice * it.qty;

    toSave.push({
      product: prod._id,
      name: prod.name,
      price: unitPrice,
      size: it.size || null,
      qty: it.qty,
    });
  }

  const order = await Order.create({
    user: userId,
    items: toSave,
    shippingAddress,
    subtotal,
    totalAmount: subtotal,
    payment: {
      provider: 'mock',
      status: 'pending',
      idempotencyKey: idempotencyKey || null,
    },
  });

  res.status(201).json(order);
});

// =============================
// GET /api/orders/mine
// Lista órdenes del usuario autenticado
// =============================
exports.mine = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) throw new ApiError(401, 'Invalid token payload');

  const orders = await Order.find({ user: userId })
    .sort('-createdAt')
    .lean();

  res.json(orders);
});

// =============================
// GET /api/orders/:id
// Ver una orden (dueño o admin)
// =============================
exports.getById = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) throw new ApiError(401, 'Invalid token payload');

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const isOwner = String(order.user) === String(userId);
  const isAdmin = req.user?.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'Forbidden');
  }

  res.json(order);
});

// =============================
// POST /api/orders/:id/pay
// Confirma el pago y descuenta stock de forma atómica
// =============================
exports.pay = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) throw new ApiError(401, 'Invalid token payload');

  const { provider = 'mock', reference } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const isOwner = String(order.user) === String(userId);
  const isAdmin = req.user?.role === 'admin';
  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'Forbidden');
  }

  // Si ya está pagada, devolver sin hacer nada
  if (order.status === 'paid' || order.payment?.status === 'paid') {
    return res.json(order);
  }

  // ─── DESCUENTO DE STOCK ATÓMICO ───────────────────────────────────────────
  // Se hace aquí (al confirmar pago) y no al crear la orden.
  // Usar $inc con $gte en la query evita race conditions:
  // si el stock llegó a 0 entre que el usuario inició y confirmó el pago,
  // el updateOne no modifica nada (modifiedCount === 0) y lanzamos error.
  for (const item of order.items) {
    if (item.size) {
      // Stock por talla
      const result = await Product.updateOne(
        {
          _id: item.product,
          'sizes.size': item.size,
          'sizes.$.stock': { $gte: item.qty },
        },
        { $inc: { 'sizes.$.stock': -item.qty } }
      );

      if (result.modifiedCount === 0) {
        throw new ApiError(
          409,
          `Stock insuficiente para ${item.name} - talla ${item.size}. Intenta de nuevo.`
        );
      }
    } else {
      // Stock general
      const result = await Product.updateOne(
        {
          _id: item.product,
          stock: { $gte: item.qty },
        },
        { $inc: { stock: -item.qty } }
      );

      if (result.modifiedCount === 0) {
        throw new ApiError(
          409,
          `Stock insuficiente para ${item.name}. Intenta de nuevo.`
        );
      }
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  order.status = 'paid';
  order.payment = {
    ...(order.payment || {}),
    provider,
    status: 'paid',
    reference: reference || `TEST-${Date.now()}`,
    paidAt: new Date(),
  };

  await order.save();

  res.json(order);
});