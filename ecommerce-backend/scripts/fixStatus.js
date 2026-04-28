require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const res = await mongoose.connection.db
    .collection('products')
    .updateMany({}, { $set: { status: 'active' } });
  console.log('actualizados:', res.modifiedCount);
  await mongoose.disconnect();
})();
