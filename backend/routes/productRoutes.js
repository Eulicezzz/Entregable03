const express = require('express');
const router = express.Router();
const {getProductos} = require('../controllers/productController');

//Ruta get
router.get('/', getProductos);

module.exports = router;