import react, { useState, useEffect } from "react";
import "../assets/css/styles.css";

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null); // null si es producto nuevo, objeto si es edición
  const [formulario, setFormulario] = useState({
    nombre: "",
    presentacion: "",
    descripcion: "",
    precio_venta: "",
    stock_actual: "",
    stock_minimo: "",
    id_categoria: "1",
  });

  //Cargar los productos desde el backend
  const cargarProductos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar los productos: ", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  //Logica para eliminar un producto
  const handleEliminar = async (id) => {
    // 1. Pedir confirmación al usuario
    if (
      window.confirm(
        "¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.",
      )
    ) {
      try {
        const res = await fetch(`http://localhost:4000/api/productos/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          // 2. Si el servidor responde OK, filtramos el estado local para borrarlo de la tabla
          setProductos(
            productos.filter((producto) => producto.id_producto !== id),
          );
          alert("Producto eliminado correctamente");
        } else {
          // Si hay un error (ej. el producto tiene lotes asociados), el backend avisará
          const errorData = await res.json();
          alert(
            "No se pudo eliminar: " +
              (errorData.message || "Error del servidor"),
          );
        }
      } catch (error) {
        console.error("Error al eliminar producto: ", error);
        alert("Hubo un fallo en la conexión con el servidor.");
      }
    }
  };

  const productosFiltrados = (productos || []).filter((p) =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const abrirEditar = (producto) => {
    setEditando(producto.id_producto);
    setFormulario(producto);
    setMostrarModal(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    // Extraemos lo que NO debe ir en el body del JSON
    // id_producto va en la URL, stock_actual no se edita aquí
    const { id_producto, stock_actual, ...datosParaEnviar } = formulario;

    const metodo = editando ? "PUT" : "POST";
    const url = editando
      ? `http://localhost:4000/api/productos/${editando}`
      : "http://localhost:4000/api/productos";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaEnviar), // Enviamos solo los datos limpios
      });

      if (res.ok) {
        alert(editando ? "Producto actualizado con éxito" : "Producto creado");
        setMostrarModal(false);
        setEditando(null);
        cargarProductos();
      } else {
        const errorText = await res.text();
        alert("Error del servidor: " + errorText);
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  const prepararEdicion = (producto) => {
    setEditando(producto.id_producto); // Guardamos el ID para saber que es una actualización
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      presentacion: producto.presentacion || "",
      precio_venta: producto.precio_venta,
      stock_minimo: producto.stock_minimo,
      id_categoria: producto.id_categoria,
    });
    setMostrarModal(true); // Abrimos el modal
  };

  return (
    <div className="admin-page-wrapper">
      <header className="admin-header">
        <h2>📦 Gestión de Inventario</h2>
        <button
          className="btn-add"
          onClick={() => {
            setEditando(null);
            setFormulario({
              nombre: "",
              descripcion: "",
              presentacion: "",
              precio_venta: "",
              stock_minimo: "",
              id_categoria: "1",
            });
            setMostrarModal(true);
          }}
        >
          + Nuevo Producto
        </button>
      </header>

      <div className="admin-tools">
        <input
          type="text"
          placeholder="Buscar producto por nombre..."
          className="search-input"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Presentación</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.id_producto}>
                <td>
                  <strong>{p.nombre}</strong>
                </td>
                <td>{p.presentacion}</td>
                <td>S/ {p.precio_venta}</td>
                <td>{p.stock_actual}</td>
                <td>
                  {p.stock_actual <= p.stock_minimo ? (
                    <span className="badge-danger">Stock Bajo ⚠️</span>
                  ) : (
                    <span className="badge-success">OK</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => prepararEdicion(p)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleEliminar(p.id_producto)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editando ? "Editar Producto" : "Nuevo Producto"}</h3>

            <form onSubmit={guardarProducto}>
              {/* Input de Nombre */}
              <input
                type="text"
                placeholder="Nombre del producto"
                value={formulario.nombre}
                onChange={(e) =>
                  setFormulario({ ...formulario, nombre: e.target.value })
                }
                required
              />

              {/* NUEVO: Campo de Descripción */}
              <textarea
                placeholder="Descripción del producto..."
                value={formulario.descripcion}
                onChange={(e) =>
                  setFormulario({ ...formulario, descripcion: e.target.value })
                }
                className="form-textarea"
              />

              {/* Input de Presentación */}
              <input
                type="text"
                placeholder="Presentación (ej: pastilla, frasco, etc.)"
                value={formulario.presentacion}
                onChange={(e) =>
                  setFormulario({ ...formulario, presentacion: e.target.value })
                }
              />

              <div className="form-row">
                {/* Precio de venta */}
                <div className="form-group">
                  <label>Precio de Venta (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formulario.precio_venta}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        precio_venta: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Solo Stock Mínimo */}
                <div className="form-group">
                  <label>Stock Mínimo (Alerta)</label>
                  <input
                    type="number"
                    placeholder="Ej: 10"
                    value={formulario.stock_minimo}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        stock_minimo: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;
