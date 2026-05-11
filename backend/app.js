const express = require('express');
const session = require('express-session');
const cors = require('cors'); // Requerido para conectar con React
const authRoutes = require('./routes/authRoutes'); // La nueva ruta limpia
require('dotenv').config();

const app = express();
const productRoutes = require('./routes/productRoutes'); // Ruta para obtener productos
const loteRoutes = require('./routes/loteRoutes'); // Ruta para manejar lotes
const ventaRoutes = require('./routes/ventaRoutes'); // Ruta para manejar ventas

// Configuración de CORS (Permite que React se comunique)
app.use(cors({
    origin: "http://localhost:3000", // El puerto de tu React
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_botica', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 3600000 
    }
}));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/lotes', loteRoutes);
app.use('/api/ventas', ventaRoutes);

// Puerto (Cambiado al 4000)
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Backend de la Botica en: http://localhost:${PORT}`);
});