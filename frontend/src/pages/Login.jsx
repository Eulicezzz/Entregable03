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
            // Asegúrate de que tu backend esté corriendo en el puerto 4000
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
                
                // Redirigimos usando el router de React
                setTimeout(() => navigate('/menu'), 1500);
            } else {
                setMensaje(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("Error en login:", error);
            setMensaje("❌ Error de conexión con el servidor");
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Usuario" 
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                />
                <br /><br />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={contrasenia}
                    onChange={(e) => setContrasenia(e.target.value)}
                    required
                />
                <br /><br />
                <button type="submit">Ingresar</button>
            </form>
            <p>{mensaje}</p>
        </div>
    );
};

export default Login;