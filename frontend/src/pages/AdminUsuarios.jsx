import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [formData, setFormData] = useState({ nombre: '', usuario: '', contrasenia: '', rol: 'Vendedor' });
    const [editandoId, setEditandoId] = useState(null);
    const navigate = useNavigate();

    const fetchUsuarios = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/usuarios');
            const data = await res.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error cargando usuarios", error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editandoId 
            ? `http://localhost:4000/api/usuarios/${editandoId}` 
            : 'http://localhost:4000/api/usuarios';
        
        const method = editandoId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setFormData({ nombre: '', usuario: '', contrasenia: '', rol: 'Vendedor' });
            setEditandoId(null);
            fetchUsuarios();
        }
    };

    const eliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            await fetch(`http://localhost:4000/api/usuarios/${id}`, { method: 'DELETE' });
            fetchUsuarios();
        }
    };

    const prepararEdicion = (u) => {
        setEditandoId(u.id_usuario);
        setFormData({ nombre: u.nombre, usuario: u.usuario, contrasenia: '', rol: u.rol });
    };

    return (
        <div className="admin-page-wrapper">
            <div className="admin-header">
                <h2>👥 Administración de Usuarios</h2>
                <button className="btn-back" onClick={() => navigate('/menu')}>⬅ Volver al Menú</button>
            </div>

            {/* Formulario con clase admin-form */}
            <form className="admin-form" onSubmit={handleSubmit}>
                <h3>{editandoId ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                <input name="nombre" placeholder="Nombre Completo" value={formData.nombre} onChange={handleChange} required />
                <input name="usuario" placeholder="Usuario" value={formData.usuario} onChange={handleChange} required />
                <input 
                    name="contrasenia" 
                    type="password" 
                    placeholder={editandoId ? "Nueva contraseña (opcional)" : "Contraseña"} 
                    value={formData.contrasenia} 
                    onChange={handleChange} 
                    required={!editandoId} 
                />
                <select name="rol" value={formData.rol} onChange={handleChange}>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Administrador">Administrador</option>
                </select>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ backgroundColor: '#28a745' }}>
                        {editandoId ? 'Actualizar' : 'Guardar'}
                    </button>
                    {editandoId && (
                        <button type="button" onClick={() => { setEditandoId(null); setFormData({ nombre: '', usuario: '', contrasenia: '', rol: 'Vendedor' }); }} style={{ backgroundColor: '#6c757d' }}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* Tabla con clase admin-table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.id_usuario}>
                                <td>{u.nombre}</td>
                                <td>{u.usuario}</td>
                                <td>{u.rol}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => prepararEdicion(u)}>✏️</button>
                                    <button className="btn-delete" onClick={() => eliminar(u.id_usuario)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsuarios;