const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ruta para registrar y retornar el ID del nuevo cliente
router.post('/registrar', async (req, res) => {
    const { nombre, dni, telefono } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO cliente (nombre, dni, telefono) VALUES (?, ?, ?)',
            [nombre, dni, telefono]
        );
        // Respondemos con el ID generado para seleccionarlo automáticamente
        res.json({ 
            success: true, 
            id_cliente: result.insertId, 
            nombre, 
            dni 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al registrar cliente" });
    }
});

router.get('/buscar/:dni', async (req, res) => {
    const { dni } = req.params;
    try {
        const [rows] = await db.query('SELECT id_cliente, nombre, dni FROM cliente WHERE dni = ?', [dni]);
        if (rows.length > 0) {
            res.json({ success: true, cliente: rows[0] });
        } else {
            res.json({ success: false, message: "Cliente no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;