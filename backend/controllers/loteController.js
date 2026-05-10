
const db = require('../config/db'); 

const registrarLote = async (req, res) => {
    const { id_producto, fecha_vencimiento, stock_lote, codigo_lote } = req.body;

    try {
        const query = `
            INSERT INTO lote (id_producto, fecha_vencimiento, stock_lote, codigo_lote) 
            VALUES (?, ?, ?, ?)
        `;
        
        await db.query(query, [id_producto, fecha_vencimiento, stock_lote, codigo_lote]);

        res.status(201).json({ success: true, message: 'Lote registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el lote: ', error);
        res.status(500).json({ success: false, message: 'Error al registrar el lote' });
    }
};

const actualizarLote = async (req, res) => {
    const { id } = req.params; // Obtenemos el id_lote de la URL
    const { fecha_vencimiento, stock_lote, codigo_lote } = req.body;

    try {
        const query = `
            UPDATE lote 
            SET fecha_vencimiento = ?, stock_lote = ?, codigo_lote = ? 
            WHERE id_lote = ?
        `;
        await db.query(query, [fecha_vencimiento, stock_lote, codigo_lote, id]);
        
        res.json({ success: true, message: 'Lote actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar lote:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar el lote' });
    }
};

const obtenerLotesPorProducto = async (req, res) => {
    const { id_producto } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM lote WHERE id_producto = ? ORDER BY fecha_vencimiento ASC',
            [id_producto]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener lotes" });
    }
};

const eliminarLote = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM lote WHERE id_lote = ?', [id]);
        res.json({ success: true, message: 'Lote eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar lote:', error);
        res.status(500).json({ success: false, message: 'No se pudo eliminar el lote' });
    }
};


module.exports = { 
    registrarLote,
    actualizarLote,
    obtenerLotesPorProducto ,
    eliminarLote
};