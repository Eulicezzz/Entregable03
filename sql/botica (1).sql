-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-05-2026 a las 19:53:44
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `botica`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alerta_stock`
--

CREATE TABLE `alerta_stock` (
  `id_alerta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `estado` enum('pendiente','atendido') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre`) VALUES
(1, 'Analgésicos'),
(2, 'Antibióticos'),
(3, 'Antihistamínicos'),
(8, 'Antiinflamatorios'),
(5, 'Antisépticos'),
(4, 'Digestivos'),
(6, 'Material Médico'),
(9, 'Salud Mental'),
(7, 'Suplementos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `dni` varchar(11) NOT NULL,
  `telefono` varchar(9) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `nombre`, `dni`, `telefono`, `email`) VALUES
(4, 'Carglos', '12345678', '999999999', NULL),
(10, 'Juan', '88888888', '999111555', NULL),
(11, 'xavi', '55555555', '967727421', NULL),
(12, 'a', '11111111', '', NULL),
(13, 'Daniel', '88118811', '989333777', NULL),
(14, 'Rosa', '66667777', '900800700', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id_detalle` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_lote` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_venta`
--

INSERT INTO `detalle_venta` (`id_detalle`, `id_venta`, `id_lote`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(2, 2, 1, 3, 0.50, 1.50),
(3, 3, 2, 3, 0.50, 1.50),
(4, 4, 1, 10, 0.50, 5.00),
(5, 5, 6, 4, 0.30, 1.20),
(6, 5, 7, 5, 0.80, 4.00),
(7, 6, 9, 130, 1.00, 130.00),
(8, 7, 11, 2, 2.50, 5.00),
(9, 8, 10, 7, 3.50, 24.50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lote`
--

CREATE TABLE `lote` (
  `id_lote` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `stock_lote` int(11) NOT NULL,
  `codigo_lote` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lote`
--

INSERT INTO `lote` (`id_lote`, `id_producto`, `fecha_vencimiento`, `stock_lote`, `codigo_lote`) VALUES
(1, 2, '2028-10-29', 337, 'LOT-2026-01'),
(2, 2, '2028-12-31', 297, 'LOT-2026-02'),
(5, 5, '2026-05-31', 12, 'LOT -2026-10'),
(6, 6, '2026-11-20', 96, 'LOT-2026-07'),
(7, 7, '2026-11-02', 145, 'LOT-2026-03'),
(8, 8, '2028-11-25', 16, 'LOT-2026-20'),
(9, 9, '2030-11-29', 1070, 'LOT-2026-09'),
(10, 10, '2026-05-31', 25, 'LOT_2026-01'),
(11, 11, '2027-02-05', 33, 'LOT-2026-04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `presentacion` varchar(50) NOT NULL,
  `stock_minimo` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `id_categoria`, `nombre`, `descripcion`, `precio_venta`, `presentacion`, `stock_minimo`) VALUES
(2, 1, 'Paracetamol', '400mg - Blíster de 10 pastillas', 0.50, 'Pastilla', 20),
(5, 2, 'Amoxicilina', '500mg - Tratamiento de infecciones bacterianas', 1.20, 'Blíster x10', 30),
(6, 3, 'Loratadina', '10mg - Alivio de síntomas de alergia', 0.30, 'Pastilla', 50),
(7, 8, 'Naproxeno', 'Analgésico y antiinflamatorio 550mg', 0.80, 'Pastilla', 25),
(8, 4, 'Omeprazol', '20mg - Cápsulas para acidez', 0.50, 'Cápsula', 40),
(9, 6, 'Gasa Estéril', 'Compresa de gasa 10x10cm', 1.00, 'Sobre', 15),
(10, 7, 'Dexametasona', 'Corticoide antiinflamatorio inyectable', 3.50, 'Ampolla', 20),
(11, 5, 'Sertralina', '50mg - Tratamiento especializado', 2.50, 'Blíster x10', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `rol` enum('Administrador','Vendedor') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `usuario`, `contrasenia`, `rol`) VALUES
(1, 'Adrian', 'adrian@gmail.com', '123456789', 'Administrador'),
(3, 'Xavier ', 'xavier@gmail.com', '12345678', 'Administrador'),
(4, 'vendedor 1', 'vendedor@gmail.com', '123', 'Vendedor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id_venta` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `monto_total` decimal(10,2) DEFAULT NULL,
  `tipo_comprobante` enum('factura','boleta') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`id_venta`, `id_cliente`, `id_usuario`, `fecha`, `monto_total`, `tipo_comprobante`) VALUES
(2, 4, 1, '2026-05-11 11:15:33', 1.50, 'boleta'),
(3, 12, 1, '2026-05-11 11:56:28', 1.50, 'boleta'),
(4, 13, 1, '2026-05-12 12:32:50', 5.00, 'boleta'),
(5, 13, 1, '2026-05-12 12:34:02', 5.20, 'boleta'),
(6, 12, 1, '2026-05-12 12:35:25', 130.00, 'boleta'),
(7, 4, 1, '2026-05-12 12:41:54', 5.00, 'boleta'),
(8, 14, 1, '2026-05-12 12:47:16', 24.50, 'boleta');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alerta_stock`
--
ALTER TABLE `alerta_stock`
  ADD PRIMARY KEY (`id_alerta`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_lote` (`id_lote`);

--
-- Indices de la tabla `lote`
--
ALTER TABLE `lote`
  ADD PRIMARY KEY (`id_lote`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alerta_stock`
--
ALTER TABLE `alerta_stock`
  MODIFY `id_alerta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `lote`
--
ALTER TABLE `lote`
  MODIFY `id_lote` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alerta_stock`
--
ALTER TABLE `alerta_stock`
  ADD CONSTRAINT `alerta_stock_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`),
  ADD CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`id_lote`) REFERENCES `lote` (`id_lote`);

--
-- Filtros para la tabla `lote`
--
ALTER TABLE `lote`
  ADD CONSTRAINT `lote_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
