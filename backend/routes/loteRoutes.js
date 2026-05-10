const express = require('express');
const router = express.Router();
const { 
    registrarLote,
    actualizarLote,
    obtenerLotesPorProducto,
    eliminarLote
} = require('../controllers/loteController');

router.post('/', registrarLote);
router.put('/:id', actualizarLote);
router.get('/producto/:id_producto', obtenerLotesPorProducto);
router.delete('/:id', eliminarLote);

module.exports = router;