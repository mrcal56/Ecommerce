const bcrypt = require('bcryptjs');

const password = 'password123';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hash); // Usa este hash para el usuario de prueba
  }
});
