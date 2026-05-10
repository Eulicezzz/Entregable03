import db from '../config/database.js';

export const reistrarLote = async (req, res) => {
    const {id_lote, id_producto, cantidad, fecha_vencimiento} = req.body;
};