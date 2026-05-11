const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        // Con promesas NO se usa callback (err, results), se usa await
        const [results] = await db.query('SELECT id_usuario, nombre, usuario, rol FROM usuario');
        res.json(results);
    } catch (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ message: "Error al obtener usuarios", error: err });
    }
});

// 2. Crear un usuario
router.post('/', async (req, res) => {
    const { nombre, usuario, contrasenia, rol } = req.body;
    try {
        const query = 'INSERT INTO usuario (nombre, usuario, contrasenia, rol) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [nombre, usuario, contrasenia, rol]);
        res.json({ message: 'Usuario creado con éxito', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El nombre de usuario ya está registrado' });
        }
        res.status(500).json({ message: 'Error en el servidor', error: err });
    }
});

// 3. Editar un usuario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, usuario, contrasenia, rol } = req.body;
    try {
        const query = 'UPDATE usuario SET nombre = ?, usuario = ?, contrasenia = ?, rol = ? WHERE id_usuario = ?';
        await db.query(query, [nombre, usuario, contrasenia, rol, id]);
        res.json({ message: 'Usuario actualizado' });
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar", error: err });
    }
});

// 4. Eliminar un usuario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM usuario WHERE id_usuario = ?', [id]);
        res.json({ message: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar", error: err });
    }
});

module.exports = router;