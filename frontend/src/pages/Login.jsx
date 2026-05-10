import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, contrasenia }),
                credentials: 'include'
            });
            const data = await res.json();

            if (data.success) {
                setMensaje(`✅ Bienvenido, ${data.usuario.nombre}`);
                localStorage.setItem('rol', data.usuario.rol);
                localStorage.setItem('nombre', data.usuario.nombre);
                setTimeout(() => navigate('/menu'), 1500);
            } else {
                setMensaje(`❌ ${data.message}`);
            }
        } catch (error) {
            setMensaje("❌ Error de conexión");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card-wrapper">
                {/* LADO IZQUIERDO: Panel Visual */}
                <div className="login-visual">
                    <div className="visual-content">
                        <h1>Botica Nova Salud</h1>
                        <p>Sistema de Gestión de Inventario y Ventas</p>
                        <div className="visual-icon">💊</div>
                    </div>
                </div>

                {/* LADO DERECHO: Formulario */}
                <div className="login-form-side">
                    <div className="form-content">
                        <h2>Iniciar Sesión</h2>
                        <form onSubmit={handleLogin}>
                            <input 
                                type="text" 
                                placeholder="Usuario" 
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                            />
                            <input 
                                type="password" 
                                placeholder="Contraseña" 
                                value={contrasenia}
                                onChange={(e) => setContrasenia(e.target.value)}
                                required
                            />
                            <button type="submit">Ingresar al Sistema</button>
                        </form>
                        <p className="mensaje-login">{mensaje}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;