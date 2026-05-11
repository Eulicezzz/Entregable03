import React, { useState, useEffect } from "react";
import "../assets/css/styles.css";

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: "",
    presentacion: "",
    descripcion: "",
    precio_venta: "",
    stock_actual: "",
    stock_minimo: "",
    id_categoria: "1",
  });
  const [mostrarModalLote, setMostrarModalLote] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [lotesDelProducto, setLotesDelProducto] = useState([]);
  const [modoEdicionLote, setModoEdicionLote] = useState(false);
  const [idLoteSeleccionado, setIdLoteSeleccionado] = useState(null);
  const [formularioLote, setFormularioLote] = useState({
    codigo_lote: "",
    fecha_vencimiento: "",
    stock_lote: "",
  });
  const [categorias, setCategorias] = useState([]);

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

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const res = await fetch(`http://localhost:4000/api/productos/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setProductos(productos.filter((p) => p.id_producto !== id));
          alert("Producto eliminado");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const productosFiltrados = (productos || []).filter((p) =>
  p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
  p.nombre_categoria?.toLowerCase().includes(busqueda.toLowerCase()) // Filtro por categoría
);

  const prepararEdicion = (producto) => {
    setEditando(producto.id_producto);
    setFormulario({ ...producto, descripcion: producto.descripcion || "" });
    setMostrarModal(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    const { id_producto, stock_actual, ...datosParaEnviar } = formulario;
    const metodo = editando ? "PUT" : "POST";
    const url = editando
      ? `http://localhost:4000/api/productos/${editando}`
      : "http://localhost:4000/api/productos";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaEnviar),
      });
      if (res.ok) {
        setMostrarModal(false);
        setEditando(null);
        cargarProductos();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const abrirGestionLotes = async (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModalLote(true);
    setModoEdicionLote(false);
    setFormularioLote({
      codigo_lote: "",
      fecha_vencimiento: "",
      stock_lote: "",
    });

    try {
      const res = await fetch(
        `http://localhost:4000/api/lotes/producto/${producto.id_producto}`,
      );
      const data = await res.json();
      setLotesDelProducto(data);
    } catch (error) {
      console.error("Error al cargar lotes:", error);
    }
  };

  const guardarLote = async (e) => {
    e.preventDefault();
    const metodo = modoEdicionLote ? "PUT" : "POST";
    const url = modoEdicionLote
      ? `http://localhost:4000/api/lotes/${idLoteSeleccionado}`
      : "http://localhost:4000/api/lotes";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formularioLote,
          id_producto: productoSeleccionado.id_producto,
        }),
      });

      if (res.ok) {
        alert(modoEdicionLote ? "Lote actualizado" : "Lote registrado");
        setModoEdicionLote(false);
        setFormularioLote({
          codigo_lote: "",
          fecha_vencimiento: "",
          stock_lote: "",
        });
        abrirGestionLotes(productoSeleccionado);
        cargarProductos();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEliminarLote = async (id) => {
    if (
      window.confirm(
        "¿Estás seguro de eliminar este lote? El stock total del producto disminuirá.",
      )
    ) {
      try {
        const res = await fetch(`http://localhost:4000/api/lotes/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("Lote eliminado con éxito");
          abrirGestionLotes(productoSeleccionado);
          cargarProductos();
        }
      } catch (error) {
        console.error("Error al eliminar el lote:", error);
      }
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/productos/categorias");
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

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
              presentacion: "",
              descripcion: "",
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
          placeholder="Buscar producto..."
          className="search-input"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
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
                <td>
                  <span className="category-badge">{p.nombre_categoria}</span>
                </td>
                <td>{p.presentacion}</td>
                <td>S/ {p.precio_venta}</td>
                <td>{p.stock_actual}</td>
                <td>
                  <span
                    className={
                      p.stock_actual <= p.stock_minimo
                        ? "badge-danger"
                        : "badge-success"
                    }
                  >
                    {p.stock_actual <= p.stock_minimo ? "Stock Bajo" : "OK"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => prepararEdicion(p)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleEliminar(p.id_producto)}
                  >
                    🗑️
                  </button>
                  <button
                    className="btn-lote"
                    onClick={() => abrirGestionLotes(p)}
                  >
                    📦
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL PRODUCTOS */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editando ? "Editar Producto" : "Nuevo Producto"}</h3>
            <form onSubmit={guardarProducto}>
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input
                  type="text"
                  value={formulario.nombre}
                  onChange={(e) =>
                    setFormulario({ ...formulario, nombre: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Presentación (Ej: Blíster x10, Frasco 100ml)</label>
                <input
                  type="text"
                  value={formulario.presentacion}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      presentacion: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formulario.descripcion}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      descripcion: e.target.value,
                    })
                  }
                />
              </div>

              {/* --- SELECTOR DE CATEGORÍA --- */}
              <div className="form-group">
                <label>Categoría del Medicamento</label>
                <select
                  className="form-input"
                  value={formulario.id_categoria}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      id_categoria: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Seleccione una categoría...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio de Venta (S/)</label>
                  <input
                    type="number"
                    step="0.01"
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
                <div className="form-group">
                  <label>Stock Mínimo</label>
                  <input
                    type="number"
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

      {/* MODAL GESTIÓN DE LOTES (TABLA + FORMULARIO ÚNICO) */}
      {mostrarModalLote && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            <h3>Lotes de: {productoSeleccionado?.nombre}</h3>

            <div className="mini-table-container">
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Vencimiento</th>
                    <th>Stock</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {lotesDelProducto.map((lote) => (
                    <tr key={lote.id_lote}>
                      <td>{lote.codigo_lote}</td>
                      <td>
                        {new Date(lote.fecha_vencimiento).toLocaleDateString()}
                      </td>
                      <td>{lote.stock_lote}</td>
                      <td>
                        <button
                          className="btn-edit-small"
                          onClick={() => {
                            setModoEdicionLote(true);
                            setIdLoteSeleccionado(lote.id_lote);
                            setFormularioLote({
                              codigo_lote: lote.codigo_lote,
                              fecha_vencimiento:
                                lote.fecha_vencimiento.split("T")[0],
                              stock_lote: lote.stock_lote,
                            });
                          }}
                        >
                          ✏️
                        </button>

                        <button
                          className="btn-delete-small"
                          onClick={() => handleEliminarLote(lote.id_lote)}
                          style={{
                            marginLeft: "5px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <hr />

            <h4>
              {modoEdicionLote ? "✏️ Editando Lote" : " Agregar Nuevo Lote"}
            </h4>
            <form onSubmit={guardarLote}>
              <div className="form-group">
                <label>Código de Lote</label>
                <input
                  type="text"
                  value={formularioLote.codigo_lote}
                  onChange={(e) =>
                    setFormularioLote({
                      ...formularioLote,
                      codigo_lote: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Fecha de Vencimiento</label>
                <input
                  type="date"
                  value={formularioLote.fecha_vencimiento}
                  onChange={(e) =>
                    setFormularioLote({
                      ...formularioLote,
                      fecha_vencimiento: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Cantidad (Stock)</label>
                <input
                  type="number"
                  value={formularioLote.stock_lote}
                  onChange={(e) =>
                    setFormularioLote({
                      ...formularioLote,
                      stock_lote: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                {modoEdicionLote ? (
                  <>
                    <button
                      type="submit"
                      className="btn-save"
                      style={{ background: "#e67e22" }}
                    >
                      {" "}
                      Guardar Cambios
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setModoEdicionLote(false);
                        setFormularioLote({
                          codigo_lote: "",
                          fecha_vencimiento: "",
                          stock_lote: "",
                        });
                      }}
                    >
                      {" "}
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button type="submit" className="btn-save">
                      {" "}
                      Guardar Nuevo Lote
                    </button>
                    <button
                      type="button"
                      onClick={() => setMostrarModalLote(false)}
                      className="btn-cancel"
                    >
                      Cerrar
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;
