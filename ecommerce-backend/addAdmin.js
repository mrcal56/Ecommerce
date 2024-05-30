const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Crear usuario administrador
const createAdminUser = async () => {
  const adminEmail = 'mar22@gmail.com'; // Email del usuario administrador
  const adminPassword = 'hola1234'; // Contraseña del usuario administrador

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email: adminEmail });
  if (existingUser) {
    console.log('Admin user already exists');
    mongoose.connection.close();
    return;
  }

  // Crear el usuario administrador
  const adminUser = new User({
    name: 'Admin1',
    email: adminEmail,
    password: hashedPassword,
    role: 'admin', // Asignar rol de administrador
  });

  try {
    await adminUser.save();
    console.log('Admin user added successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding admin user:', error);
    mongoose.connection.close();
  }
};

createAdminUser();
