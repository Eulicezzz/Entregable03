const db = require('../config/db');

const registrarCliente = async (req, res) => {
    const { nombre, dni, telefono, email } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO cliente (nombre, dni, telefono, email) VALUES (?, ?, ?, ?)',
            [nombre, dni, telefono, email]
        );
        res.json({ success: true, id_cliente: result.insertId, message: "Cliente registrado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar cliente (posible DNI duplicado)" });
    }
};

const buscarClientePorDni = async (req, res) => {
    const { dni } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM cliente WHERE dni = ?', [dni]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "No encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

module.exports = { registrarCliente, buscarClientePorDni };