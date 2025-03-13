
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './Componentes/Principal/chat'; // Asegúrate de que la ruta sea correcta
import Principal from "./Vista/Principal"
const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Principal/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;