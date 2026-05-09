const db = require('../config/db');

const getProductos = async (req, res) => {
    try{
        const [rows] = await db.query('SELECT * FROM producto');
        res.json(rows);
    }catch(error){
        console.error('Error al obtener productos: ', error);
        res.status(500).json({message: 'Error al obtener productos'});
    }
};

module.exports = {
    getProductos
};