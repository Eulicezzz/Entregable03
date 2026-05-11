import React, { useState } from "react";

const Ventas = () => {
  // Estados
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadVenta, setCantidadVenta] = useState(1);
  const [cliente, setCliente] = useState({
    nombre: "Público General",
    id_cliente: 1,
    dni: "",
  });
  const [mostrarFormCliente, setMostrarFormCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    email: "",
  });

  // Funciones de lógica
  const buscarProductos = async (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    if (valor.length > 1) {
      try {
        const res = await fetch(
          `http://localhost:4000/api/ventas/buscar?termino=${valor}`,
        );
        const data = await res.json();
        setResultados(data);
      } catch (error) {
        console.error("Error al buscar:", error);
      }
    } else {
      setResultados([]);
    }
  };

  const agregarAlCarrito = (item) => {
    const existe = carrito.find((p) => p.id_lote === item.id_lote);
    if (existe) {
      if (existe.cantidad < item.stock_lote) {
        setCarrito(
          carrito.map((p) =>
            p.id_lote === item.id_lote ? { ...p, cantidad: p.cantidad + 1 } : p,
          ),
        );
      } else {
        alert("No hay más stock en este lote");
      }
    } else {
      setCarrito([...carrito, { ...item, cantidad: 1 }]);
    }
  };

  const prepararParaCarrito = (item) => {
    setProductoSeleccionado(item);
    setCantidadVenta(1); // Resetear a 1 cada vez
  };

  const confirmarAgregarAlCarrito = () => {
    const item = productoSeleccionado;
    const cantidad = parseInt(cantidadVenta);

    if (cantidad <= 0 || cantidad > item.stock_lote) {
      alert("Cantidad no válida o superior al stock disponible");
      return;
    }

    const existe = carrito.find((p) => p.id_lote === item.id_lote);
    if (existe) {
      setCarrito(
        carrito.map((p) =>
          p.id_lote === item.id_lote
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p,
        ),
      );
    } else {
      setCarrito([...carrito, { ...item, cantidad: cantidad }]);
    }

    setProductoSeleccionado(null); // Cerrar el selector
  };

  const eliminarDelCarrito = (id_lote) => {
    // Filtramos el carrito para quitar el producto que coincida con ese lote
    setCarrito(carrito.filter((item) => item.id_lote !== id_lote));
  };

  const manejarGuardarCliente = async () => {
    // Validar que al menos tenga nombre y DNI
    if (!nuevoCliente.nombre || !nuevoCliente.dni) {
      alert("Por favor, ingresa el nombre y DNI del cliente.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/clientes/registrar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoCliente),
        },
      );

      const data = await response.json();

      if (data.success) {
        // 1. Actualizamos el cliente seleccionado para la venta
        setCliente({
          id_cliente: data.id_cliente,
          nombre: data.nombre,
          dni: data.dni,
          correo: data.email
        });

        // 2. Cerramos el formulario y limpiamos los campos
        setMostrarFormCliente(false);
        setNuevoCliente({ nombre: "", dni: "", telefono: "", email: "" });

        alert("Cliente registrado y seleccionado con éxito.");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  const buscarCliente = async (dniBusqueda) => {
    if (dniBusqueda.length >= 8) { // DNI peruano tiene 8 dígitos
        try {
            const res = await fetch(`http://localhost:4000/api/clientes/buscar/${dniBusqueda}`);
            const data = await res.json();
            
            if (data.success) {
                // Si existe, lo seleccionamos automáticamente
                setCliente(data.cliente);
                setMostrarFormCliente(false);
                alert(`Cliente encontrado: ${data.cliente.nombre}`);
            } else {
                // Si no existe, podrías limpiar el nombre para que lo registren
                setNuevoCliente({ ...nuevoCliente, dni: dniBusqueda, nombre: '', telefono: '' });
                console.log("Cliente no existe, proceda a registrar.");
            }
        } catch (error) {
            console.error("Error al buscar cliente:", error);
        }
    }
};

  return (
    <div className="admin-page-wrapper">
      <header
        className="admin-header"
        style={{
          padding: "20px",
          backgroundColor: "#f4f4f4",
          marginBottom: "20px",
        }}
      >
        <h2>💊 Nueva Venta</h2>
      </header>

      <div style={{ display: "flex", gap: "20px", padding: "0 20px" }}>
        {/* BUSCADOR */}
        <div style={{ flex: 2 }}>
          <input
            type="text"
            placeholder="🔍 Buscar medicamento o lote..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
            value={busqueda}
            onChange={buscarProductos}
          />

          <div style={{ marginTop: "20px" }}>
            {resultados.map((item) => (
              <div
                key={item.id_lote}
                onClick={() => prepararParaCarrito(item)}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                }}
              >
                <div>
                  <strong>{item.nombre}</strong> -{" "}
                  <small>{item.presentacion}</small>
                  <br />
                  <small>
                    Lote: {item.codigo_lote} | Vence:{" "}
                    {new Date(item.fecha_vencimiento).toLocaleDateString()}
                  </small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                    S/ {item.precio_venta}
                  </span>
                  <br />
                  <small>Stock: {item.stock_lote}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {productoSeleccionado && (
          <div
            style={{
              backgroundColor: "#e8f4f0",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "15px",
              border: "2px solid #006666",
            }}
          >
            <h4>Seleccionar Cantidad: {productoSeleccionado.nombre}</h4>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="number"
                min="1"
                max={productoSeleccionado.stock_lote}
                value={cantidadVenta}
                onChange={(e) => setCantidadVenta(e.target.value)}
                style={{ padding: "8px", width: "80px", borderRadius: "5px" }}
              />
              <span>(Max: {productoSeleccionado.stock_lote})</span>
              <button
                onClick={confirmarAgregarAlCarrito}
                style={{
                  backgroundColor: "#006666",
                  color: "white",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Añadir
              </button>
              <button
                onClick={() => setProductoSeleccionado(null)}
                style={{
                  backgroundColor: "#ccc",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #eee",
            marginBottom: "15px",
          }}
        >
          <h4>👤 Cliente</h4>
          <p>
            <strong>{cliente.nombre}</strong>{" "}
            {cliente.dni && `(DNI: ${cliente.dni})`}
          </p>
          <button
  onClick={() => {
    setMostrarFormCliente(!mostrarFormCliente);
    setNuevoCliente({ nombre: "", dni: "", telefono: "" }); // Limpia al abrir/cerrar
  }}
  style={{
    fontSize: "0.8rem",
    backgroundColor: "#006666",
    color: "white", // Cambié el color a blanco para que combine con tu diseño
    border: "none",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "4px"
  }}
>
  {mostrarFormCliente ? "Cancelar" : "Cambiar / Registrar Cliente"}
</button>

          {mostrarFormCliente && (
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <input
  placeholder="DNI"
  value={nuevoCliente.dni} // Añadimos el value
  onChange={(e) => {
    const val = e.target.value;
    setNuevoCliente({ ...nuevoCliente, dni: val });
    buscarCliente(val); // <--- Aquí disparamos la búsqueda automática
  }}
  style={{ padding: "5px" }}
  maxLength={8} // Para DNI peruano
/>
              <input
                placeholder="Nombre Completo"
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
                }
                style={{ padding: "5px" }}
              />
              <input
                placeholder="Teléfono"
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
                }
                style={{ padding: "5px" }}
              />
              <input
  type="email"
  placeholder="Correo Electrónico"
  value={nuevoCliente.email}
  onChange={(e) =>
    setNuevoCliente({ ...nuevoCliente, email: e.target.value })
  }
  style={{ padding: "5px" }}
/>
              <button
                onClick={manejarGuardarCliente} // <--- Conectamos la función aquí
                style={{
                  backgroundColor: "#006666",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Guardar y Seleccionar
              </button>
            </div>
          )}
        </div>

        {/* CARRITO */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #eee",
            height: "fit-content",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              borderBottom: "2px solid #006666",
              paddingBottom: "10px",
              marginBottom: "15px",
            }}
          >
            🛒 Resumen
          </h3>

          <div className="carrito-list">
            {carrito.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center" }}>
                El carrito está vacío
              </p>
            ) : (
              carrito.map((item) => (
                <div
                  key={item.id_lote}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                    paddingBottom: "8px",
                    borderBottom: "1px dotted #ddd",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: "block", fontSize: "0.9rem" }}>
                      {item.nombre}
                    </strong>
                    <small style={{ color: "#666" }}>
                      Cant: {item.cantidad} x S/ {item.precio_venta}
                    </small>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: "#333" }}>
                      S/ {(item.precio_venta * item.cantidad).toFixed(2)}
                    </span>

                    {/* BOTÓN ELIMINAR */}
                    <button
                      onClick={() => eliminarDelCarrito(item.id_lote)}
                      style={{
                        backgroundColor: "#ff4d4d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 8px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                      title="Quitar del carrito"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            style={{
              marginTop: "20px",
              paddingTop: "15px",
              borderTop: "2px solid #eee",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              <span>Total:</span>
              <span style={{ color: "#006666" }}>
                S/{" "}
                {carrito
                  .reduce(
                    (acc, item) => acc + item.precio_venta * item.cantidad,
                    0,
                  )
                  .toFixed(2)}
              </span>
            </div>

            <button
              disabled={carrito.length === 0}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: carrito.length === 0 ? "#ccc" : "#006666",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: carrito.length === 0 ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Finalizar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ventas;
