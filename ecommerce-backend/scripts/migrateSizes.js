require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const all = await Product.find({}).select({ sizes: 1 }).lean();

    let updates = 0;
    for (const doc of all) {
      if (!Array.isArray(doc.sizes)) continue;

      const needs = doc.sizes.some(s => typeof s === 'string');
      if (!needs) continue;

      const newSizes = doc.sizes
        .map(s => (typeof s === 'string' ? { size: s, stock: 0 } : s))
        .filter(Boolean);

      await Product.updateOne({ _id: doc._id }, { $set: { sizes: newSizes } });
      updates++;
    }

    console.log(`Migración completada. Documentos actualizados: ${updates}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
