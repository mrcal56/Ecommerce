const bcrypt = require('bcryptjs');

const registerUser = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('Registered User - Original password:', password);
  console.log('Registered User - Hashed password:', hashedPassword);
  return hashedPassword;
};

const loginUser = async (enteredPassword, storedHash) => {
  const isMatch = await bcrypt.compare(enteredPassword, storedHash);
  console.log('Login User - Entered password:', enteredPassword);
  console.log('Login User - Stored hash:', storedHash);
  console.log('Password match:', isMatch);
  return isMatch;
};

// Simular registro de usuario
const simulateUserRegistrationAndLogin = async () => {
  const originalPassword = 'password123';
  const hashedPassword = await registerUser(originalPassword);

  // Simular inicio de sesión con la contraseña original
  await loginUser(originalPassword, hashedPassword);
};

simulateUserRegistrationAndLogin();
