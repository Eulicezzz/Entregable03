import React from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol'); // Recuperamos el rol que guardamos en el Login

  useEffect(() => { //Se ejecuta al cargar la página
    if(!rol) {
        navigate('/'); // Si no hay rol, redirigimos al login
    }
  }, [rol, navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Botica Nova Salud 💊</h1>
      <h3>Bienvenido al Menú Principal</h3>
      <p>Nivel de acceso: <strong>{rol}</strong></p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <button onClick={() => navigate('/inventario')} style={buttonStyle}>📦 Inventario</button>
        <button onClick={() => navigate('/ventas')} style={buttonStyle}>💰 Ventas</button>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} style={logoutStyle}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

const buttonStyle = { padding: '15px 30px', fontSize: '16px', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: '#006677', color: 'white' };
const logoutStyle = { ...buttonStyle, backgroundColor: '#d9534f' };

export default Menu;