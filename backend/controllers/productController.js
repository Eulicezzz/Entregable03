const db = require("../config/db");

const getProductos = async (req, res) => {
  try {
    const query = `
      SELECT
        p.*,
        IFNULL(SUM(l.stock_lote), 0) AS stock_actual
      FROM producto p
      LEFT JOIN lote l ON p.id_producto = l.id_producto
      GROUP BY p.id_producto
    `;

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener productos: ", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

const crearProducto = async (req, res) => {
  const {
    id_categoria,
    nombre,
    descripcion,
    precio_venta,
    presentacion,
    stock_minimo,
  } = req.body;
  const query =
    "INSERT INTO producto (id_categoria, nombre, descripcion, precio_venta, presentacion, stock_minimo) VALUES (?, ?, ?, ?, ?, ?)";
  try {
    const [result] = await db.query(query, [
      id_categoria,
      nombre,
      descripcion,
      precio_venta,
      presentacion,
      stock_minimo,
    ]);
    res.json({
      success: true,
      message: "Producto creado",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear producto: ", error);
    res
      .status(500)
      .json({ success: false, message: "Error al crear producto" });
  }
};

const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    // CORRECCIÓN: Los parámetros van en un array []
    const [result] = await db.query(
      "DELETE FROM producto WHERE id_producto = ?",
      [id],
    );

    // Es buena práctica verificar si realmente se borró algo
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Producto no encontrado" });
    }

    res.json({ success: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto: ", error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar producto" });
  }
};

const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const {
    id_categoria,
    nombre,
    descripcion,
    precio_venta,
    presentacion,
    stock_minimo,
  } = req.body;
  const query =
    "UPDATE producto SET id_categoria = ?, nombre = ?, descripcion = ?, precio_venta = ?, presentacion = ?, stock_minimo = ? WHERE id_producto = ?";

  try {
    await db.query(query, [
      id_categoria,
      nombre,
      descripcion,
      precio_venta,
      presentacion,
      stock_minimo,
      id,
    ]);
    res.json({ success: true, message: "Poducto actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar producto: ", error);
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar producto" });
  }
};

module.exports = {
  getProductos,
  crearProducto,
  eliminarProducto,
  actualizarProducto,
};
