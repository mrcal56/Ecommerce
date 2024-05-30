const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Ajusta la ruta según tu estructura de proyecto

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const runTest = async () => {
  const password = 'password123';

  // Conectar a la base de datos
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Crear y guardar un nuevo usuario
  const newUser = new User({
    name: 'Test User',
    email: 'testuser@example.com',
    password,
    role: 'user',
  });

  await newUser.save();

  // Buscar el usuario y comparar la contraseña
  const user = await User.findOne({ email: 'testuser@example.com' });
  const isMatch = await user.matchPassword(password);
  console.log('Comparing passwords');
  console.log('Entered password:', password);
  console.log('Stored password:', user.password);
  console.log('Password match result:', isMatch);

  // Cerrar la conexión a la base de datos
  mongoose.connection.close();
};

runTest().catch((error) => {
  console.error('Error in testHashingInProject:', error);
});
