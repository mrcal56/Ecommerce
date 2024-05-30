const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('Comparing passwords');
  console.log('Entered password:', enteredPassword);
  console.log('Stored password:', this.password);
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log('Password match result:', isMatch);
  return isMatch;
};

// Middleware para hash de contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Hashed password:', this.password);
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
