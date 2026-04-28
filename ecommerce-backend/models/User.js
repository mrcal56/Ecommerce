// Carga Mongoose para definir el esquema
const mongoose = require('mongoose');
// Carga bcrypt para hash de contraseñas
const bcrypt = require('bcryptjs');

// Define el esquema de usuario con validaciones
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },          // Nombre del usuario
  email: { type: String, required: true, unique: true, lowercase: true, trim: true }, // Email único
  password: { type: String, required: true, minlength: 6 },    // Contraseña con longitud mínima
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // Rol con valores restringidos
}, { timestamps: true });

// Pre-hook para hashear la contraseña solo si fue modificada
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();            // Si no cambió, no hashea
  this.password = await bcrypt.hash(this.password, 12);       // Hashea con sal por defecto
  next();                                                     // Continúa el flujo
});

// Método de instancia para comparar contraseñas
userSchema.methods.compare = function (plain) {
  return bcrypt.compare(plain, this.password);                // Retorna promesa booleana
};

// Exporta el modelo User
module.exports = mongoose.model('User', userSchema);
