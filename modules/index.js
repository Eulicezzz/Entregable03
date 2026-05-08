const express = require('express');
const router = express.Router();
const db = require('../config/db');  

const path = require('path');

// Ruta para procesar el login
router.post('/login', async (req, res) => {
    const { usuario, contrasenia } = req.body;

    try {
        const [rows] = await db.query(
            'SELECT * FROM usuario WHERE usuario = ? AND contrasenia = ?',
            [usuario, contrasenia]
        );

        if (rows.length > 0) {
            const user = rows[0];

            // Guardar el rol EN LA SESIÓN
            req.session.userId = user.id_usuario;
            req.session.rol = user.rol;
            req.session.nombre = user.nombre;

            res.json({
                success: true,
                message: 'Bienvenido',
                usuario: { 
                    nombre: user.nombre, 
                    rol: user.rol 
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error("Error en Login:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

router.get('/api/perfil', (req, res) => {
    if (req.session.userId) {
        res.json({
            autenticado: true,
            nombre: req.session.nombre,
            rol: req.session.rol
        });
    } else {
        res.status(401).json({ autenticado: false, message: 'No has iniciado sesión' });
    }
});

router.get('/menu', (req, res) => {
    // Si no hay sesión, lo redirigimos al login de inmediato
    if (!req.session.userId) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, '../public/menu.html'));
});


// 4. RUTA PARA CERRAR SESIÓN

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.redirect('/menu');
        }
        res.clearCookie('connect.sid'); // Limpia la cookie del navegador
        res.redirect('/');
    });
});

module.exports = router;