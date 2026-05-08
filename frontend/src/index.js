import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Esto busca App.js en la misma carpeta

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);