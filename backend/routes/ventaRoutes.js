const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

router.get('/buscar', ventaController.buscarProductosParaVenta);
router.post('/registrar', ventaController.registrarVenta);

module.exports = router;