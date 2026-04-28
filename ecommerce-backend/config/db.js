// Carga Mongoose para conectar con MongoDB
const mongoose = require('mongoose');

module.exports = async function connectDB() {
  // Lee la URI desde variables de entorno
  const uri = process.env.MONGO_URI;
  // Lanza error si no existe la URI
  if (!uri) throw new Error('MONGO_URI is missing in environment');
  // Realiza la conexión con Mongoose usando la URI
  await mongoose.connect(uri);
  // Loguea confirmación de conexión
  console.log('MongoDB connected');
};
