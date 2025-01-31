// index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cors = require('cors');


dotenv.config(); // Asegúrate de que dotenv se configura antes de cualquier otra cosa

connectDB();


const app = express();

// Configurar CORS
app.use(cors({
  origin: "*", // Asegura que cualquier frontend pueda acceder
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

/*app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); */
