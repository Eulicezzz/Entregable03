const express = require('express');
const router = express.Router();
const {getProductos, crearProducto, eliminarProducto, actualizarProducto} = require('../controllers/productController');

//Ruta get
router.get('/', getProductos);
router.post('/', crearProducto);
router.delete('/:id', eliminarProducto);
router.put('/:id', actualizarProducto);

module.exports = router;