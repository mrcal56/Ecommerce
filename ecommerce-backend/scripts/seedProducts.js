const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/product');

dotenv.config();

const products = [
  {
    name: 'Producto 1',
    description: 'Descripción del Producto 1',
    price: 10.0,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    name: 'Producto 2',
    description: 'Descripción del Producto 2',
    price: 20.0,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    name: 'Producto 3',
    description: 'Descripción del Producto 3',
    price: 30.0,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    name: 'Producto 4',
    description: 'Descripción del Producto 4',
    price: 40.0,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    name: 'Producto 5',
    description: 'Descripción del Producto 5',
    price: 50.0,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    name: 'Producto 6',
    description: 'Descripción del Producto 6',
    price: 60.0,
    imageUrl: 'https://via.placeholder.com/150',
  },
];

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Función para poblar la base de datos
const seedProducts = async () => {
  try {
    // Eliminar todos los productos existentes
    await Product.deleteMany({});
    // Insertar los productos de ejemplo
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Ejecutar la función para poblar la base de datos
seedProducts();
