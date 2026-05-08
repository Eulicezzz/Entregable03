const express = require('express');
const path = require('path');
const session = require('express-session');
const routes = require('./modules/index'); // Asegúrate de que la carpeta se llame 'modules'

const app = express();

// Middlewares necesarios para leer los datos del login
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'clave', // Una frase cualquiera para encriptar la sesión
    resave: false,                  // No guarda la sesión si no hubo cambios
    saveUninitialized: false,       // No crea sesiones vacías
    cookie: { 
        secure: false,              // false porque estamos en localhost (sin HTTPS)
        maxAge: 3600000             // Tiempo de vida: 1 hora (en milisegundos)
    }
}));



// Servir archivos estáticos (tu index.html debe estar en una carpeta llamada 'public')
app.use(express.static(path.join(__dirname, 'public')));

// Usar las rutas
app.use('/', routes);

app.listen(3000, () => {
    console.log("✅ Servidor funcionando en http://localhost:3000");
});