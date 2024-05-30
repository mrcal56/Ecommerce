// Importamos los módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargamos las variables de entorno desde el archivo .env
dotenv.config();

// Creamos una instancia de la aplicación de Express
const app = express();

// Middleware para habilitar CORS y parsear JSON
app.use(cors());
app.use(express.json());

// Conexión a la base de datos de MongoDB usando Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected')) // Mensaje en consola si la conexión es exitosa
.catch((err) => console.log(err)); // Mensaje en consola si hay un error

// Ruta principal para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Definimos el puerto en el que correrá el servidor
const PORT = process.env.PORT || 5000;

// Iniciamos el servidor
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
