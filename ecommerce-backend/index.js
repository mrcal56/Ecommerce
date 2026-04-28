// Carga el framework Express
const express = require('express');
// Carga variables de entorno desde .env
const dotenv = require('dotenv');
// Inicializa el uso de variables de entorno lo antes posible
dotenv.config();
// Middleware para cabeceras de seguridad HTTP
const helmet = require('helmet');
// Middleware para CORS configurable
const cors = require('cors');
// Middleware para comprimir respuestas
const compression = require('compression');
// Logger HTTP para desarrollo/producción
const morgan = require('morgan');
// Limitador de peticiones para prevenir abuso
const rateLimit = require('express-rate-limit');

// Conexión a la base de datos Mongo
const connectDB = require('./config/db');

// Rutas del sistema
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const usersRoutes = require('./routes/userRoutes');
const paymentMpRoutes = require('./routes/paymentMPRoutes');

// Middlewares de manejo de errores y 404
const { errorHandler, notFound } = require('./middlewares/error');



// Establece conexión a MongoDB
connectDB();

// Crea la aplicación Express
const app = express();

// Aplica cabeceras de seguridad por defecto
app.use(helmet());

// Comprime las respuestas para mejorar rendimiento
app.use(compression());

// Configura el logger HTTP (formato depende del entorno)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Convierte el body JSON a objeto JS con límite razonable
app.use(express.json({ limit: '1mb' }));

// Construye la lista de orígenes permitidos para CORS desde env
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Configura CORS permitiendo credenciales y controlando orígenes
app.use(cors({
  origin(origin, cb) {
    // Permite herramientas como cURL/Postman sin origin
    if (!origin) return cb(null, true);
    // Autoriza solo orígenes declarados en CORS_ORIGINS
    if (allowedOrigins.includes(origin)) return cb(null, true);
    // Rechaza orígenes no declarados
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limita el número de peticiones a los prefijos /api
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

// Endpoint de salud para verificar que la API corre
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Monta las rutas de autenticación, productos y órdenes debajo de /api
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentMpRoutes);


app.use(notFound);
app.use(errorHandler);

// Define el puerto desde env o usa 5000 por defecto
const PORT = process.env.PORT || 5000;

// Inicia el servidor HTTP
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
