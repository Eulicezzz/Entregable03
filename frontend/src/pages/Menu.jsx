import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    // 1. Iniciamos con lo que haya en localStorage para que la pantalla no salga en blanco
    const [datosUsuario, setDatosUsuario] = useState({ 
        nombre: localStorage.getItem('nombre') || '', 
        rol: localStorage.getItem('rol') || '' 
    });
    const navigate = useNavigate();

    useEffect(() => {
        const verificarSesion = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/auth/perfil', { 
                    credentials: 'include' 
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data && data.autenticado) {
                        setDatosUsuario({ nombre: data.nombre, rol: data.rol });
                        localStorage.setItem('rol', data.rol);
                        localStorage.setItem('nombre', data.nombre);
                    }
                } else {
                    // Solo redirigir si realmente no hay nada en localStorage
                    if (!localStorage.getItem('rol')) {
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error("Error de conexión");
                // Si falla la red pero tenemos datos locales, no sacamos al usuario
                if (!localStorage.getItem('rol')) navigate('/');
            }
        };

        verificarSesion();
    }, [navigate]);
    const handleLogout = async () => {
        try {
            // Llamamos al backend usando POST (como está en tu authRoutes)
            await fetch('http://localhost:4000/api/auth/logout', { 
                method: 'POST', 
                credentials: 'include' 
            });
        } catch (error) {
            console.error("Error al avisar al servidor del logout");
        }
        
        // Limpiamos todo y redirigimos dentro de React
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="menu-card">
            {/* Usamos datosUsuario que viene del estado */}
            <h1>Bienvenido, {datosUsuario.nombre || 'Cargando...'}</h1>
            <p>Nivel: {datosUsuario.rol}</p>
            
            <div className="options-grid">
                <div className="option-item" onClick={() => navigate('/ventas')}>
                    <h3>🛒 Ventas</h3>
                    <p>Registrar salida</p>
                </div>

                <div className="option-item" onClick={() => navigate('/productos')}>
                    <h3>📦 Inventario</h3>
                    <p className="menu-link">Ver stock</p>
                </div>

                {/* Comprobación de rol (asegúrate que en la DB sea 'Administrador') */}
                {datosUsuario.rol === 'Administrador' && (
                    <div className="option-item admin-style" onClick={() => navigate('/admin-usuarios')} style={{ border: '2px solid gold' }}>
                        <h3>👥 Usuarios</h3>
                        <p>Administrar personal</p>
                    </div>
                )}
            </div>

            <button className="btn-logout" onClick={handleLogout}>
                Cerrar Sesión
            </button>
        </div>
    );
};

export default Menu;