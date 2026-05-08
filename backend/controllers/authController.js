const db = require('../config/db');

// Lógica de Login
const login = async (req, res) => {
    const { usuario, contrasenia } = req.body;
    try {
        const [rows] = await db.query(
            'SELECT * FROM usuario WHERE usuario = ? AND contrasenia = ?',
            [usuario, contrasenia]
        );

        if (rows.length > 0) {
            const user = rows[0];
            req.session.userId = user.id_usuario;
            req.session.rol = user.rol;
            req.session.nombre = user.nombre;

            res.json({
                success: true,
                usuario: { nombre: user.nombre, rol: user.rol }
            });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

// Obtener datos del perfil actual
const getPerfil = (req, res) => {
    if (req.session.userId) {
        res.json({
            autenticado: true,
            nombre: req.session.nombre,
            rol: req.session.rol
        });
    } else {
        res.status(401).json({ autenticado: false });
    }
};

// Cerrar Sesión
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ success: false });
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Sesión cerrada' });
    });
};

module.exports = { login, getPerfil, logout };