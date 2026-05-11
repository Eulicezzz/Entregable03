const db = require('../config/db');

const registrarVenta = async (req, res) => {
    const { id_cliente, id_usuario, monto_total, tipo_comprobante, productos } = req.body;
    const connection = await db.getConnection(); // Obtenemos conexión para la transacción

    try {
        await connection.beginTransaction(); // Iniciamos

        // 1. Insertar en la tabla 'venta'
        const [resVenta] = await connection.query(
            'INSERT INTO venta (id_cliente, id_usuario, monto_total, tipo_comprobante) VALUES (?, ?, ?, ?)',
            [id_cliente, id_usuario, monto_total, tipo_comprobante]
        );
        const idVenta = resVenta.insertId;

        // 2. Insertar detalles y actualizar stock
        for (const prod of productos) {
            await connection.query(
                'INSERT INTO detalle_venta (id_venta, id_lote, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                [idVenta, prod.id_lote, prod.cantidad, prod.precio_venta, (prod.cantidad * prod.precio_venta)]
            );

            await connection.query(
                'UPDATE lote SET stock_lote = stock_lote - ? WHERE id_lote = ?',
                [prod.cantidad, prod.id_lote]
            );
        }

        await connection.commit(); // Si todo salió bien, guardamos cambios
        res.json({ success: true, message: 'Venta registrada con éxito', id_venta: idVenta });

    } catch (error) {
        await connection.rollback(); // Si algo falló, deshacemos todo lo anterior
        console.error("Error en la transacción:", error);
        res.status(500).json({ message: 'Error al procesar la venta', error });
    } finally {
        connection.release(); // Liberamos la conexión
    }
};

const buscarProductosParaVenta = async (req, res) => {
    const { termino } = req.query;
    try {
        const query = `
            SELECT 
                p.id_producto, p.nombre, p.presentacion, p.precio_venta,
                l.id_lote, l.codigo_lote, l.fecha_vencimiento, l.stock_lote,
                c.nombre AS nombre_categoria
            FROM producto p
            INNER JOIN lote l ON p.id_producto = l.id_producto
            INNER JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE (p.nombre LIKE ? OR l.codigo_lote LIKE ?) 
            AND l.stock_lote > 0
            ORDER BY l.fecha_vencimiento ASC
        `;
        const [rows] = await db.query(query, [`%${termino}%`, `%${termino}%`]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error en la búsqueda" });
    }
};

module.exports = {
    registrarVenta,
    buscarProductosParaVenta
};