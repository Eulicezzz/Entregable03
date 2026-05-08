// seed.js
const db = require('./config/db');

async function crearUsuario() {
    try {
        const sql = `INSERT INTO usuario (nombre, usuario, contrasenia, rol) 
                     VALUES (?, ?, ?, ?)`;
        await db.query(sql, ['Adrian', 'adrian@gmail.com', '123456789', 'Administrador']);
        
        console.log(" Usuario de prueba creado con éxito");
        process.exit();
    } catch (error) {
        console.error(" Error al crear usuario:", error);
        process.exit(1);
    }
}

crearUsuario();