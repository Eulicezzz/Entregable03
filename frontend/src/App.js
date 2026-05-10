import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import AdminUsuarios from './pages/AdminUsuarios';
import './assets/css/styles.css'; // Importamos tus estilos globales

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin-usuarios" element={<AdminUsuarios />} />
      </Routes>
    </Router>
  );
}

export default App;