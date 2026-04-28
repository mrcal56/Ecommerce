const Product = require('../models/Product');
const { asyncHandler, ApiError } = require('../middlewares/error');
const paginate = require('../utils/paginate');
const pick = require('../utils/pick');

const normalizeSizesIn = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(s => {
      if (!s) return null;
      if (typeof s === 'string') return { size: s, stock: 0 };
      if (typeof s === 'object') {
        const size = String(s.size || s.label || '').trim();
        const stock = Number.isFinite(+s.stock) ? +s.stock : 0;
        return size ? { size, stock } : null;
      }
      return null;
    })
    .filter(Boolean);
};

const normalizeSizesOut = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map(s => (typeof s === 'string' ? { size: s, stock: 0 } : s));
};

exports.list = asyncHandler(async (req, res) => {
  const { q, category, status, sort = '-createdAt' } = req.query;
  const { skip, limit, page } = paginate(req.query, { page: req.query.page, limit: req.query.limit });
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };

  const [items, total] = await Promise.all([
    Product.find(filter, {}, { sort, skip, limit }).lean(),
    Product.countDocuments(filter)
  ]);

  const normalized = items.map(p => ({ ...p, sizes: normalizeSizesOut(p.sizes) }));
  res.json({ items: normalized, page, limit, total });
});

exports.getById = asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id).lean();
  if (!p) throw new ApiError(404, 'Product not found');
  p.sizes = normalizeSizesOut(p.sizes);
  res.json(p);
});

exports.create = asyncHandler(async (req, res) => {
  const body = pick(req.body, ['name','slug','price','stock','imageUrl','description','category','sizes','status']);
  if (body.sizes) body.sizes = normalizeSizesIn(body.sizes);
  const p = await Product.create(body);
  res.status(201).json(p);
});

exports.update = asyncHandler(async (req, res) => {
  const body = pick(req.body, ['name','slug','price','stock','imageUrl','description','category','sizes','status']);
  if (body.sizes) body.sizes = normalizeSizesIn(body.sizes);
  const p = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
  if (!p) throw new ApiError(404, 'Product not found');
  res.json(p);
});

exports.remove = asyncHandler(async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) throw new ApiError(404, 'Product not found');
  res.status(204).end();
});


exports.upsertSizeStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const size  = String(req.body.size || '').toUpperCase().trim();
    const delta = Number(req.body.delta || 0);

    if (!size) return res.status(400).json({ error: 'size requerido' });

    const inc = await Product.updateOne(
      { _id: id, 'sizes.size': size },
      { $inc: { 'sizes.$.stock': delta } }
    );

    if (inc.modifiedCount) {
      const doc = await Product.findById(id).lean();
      return res.json(doc);
    }

    const push = await Product.updateOne(
      { _id: id, 'sizes.size': { $ne: size } },
      { $push: { sizes: { size, stock: Math.max(0, delta) } } }
    );

    if (push.matchedCount) {
      const doc = await Product.findById(id).lean();
      return res.json(doc);
    }

    return res.status(404).json({ error: 'Producto no encontrado' });
  } catch (e) { next(e); }
};
