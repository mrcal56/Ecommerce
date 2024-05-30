const bcrypt = require('bcryptjs');

const originalPassword = 'password123';
const storedHash = '$2a$10$/t3zyqu206nLLBNutlJdzOcWok04DMeJNePfURVzHcgIhjxq0WsxK'; // Hash obtenido del proceso de registro

bcrypt.compare(originalPassword, storedHash, (err, isMatch) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log('Password match:', isMatch); // Debería ser true si el hash y la contraseña son correctos
  }
});
