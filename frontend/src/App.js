import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import AdminUsuarios from './pages/AdminUsuarios';
import GestionProductos from './pages/GestionProductos';
import Ventas from './pages/Ventas';

import './assets/css/styles.css'; // Importamos tus estilos globales


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin-usuarios" element={<AdminUsuarios />} />
        <Route path="/productos" element={<GestionProductos />} />
        <Route path="/ventas" element={<Ventas />} />
      </Routes>
    </Router>
  );
}

export default App;