// src/Routers.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Principal from './Vista/Principal'; // Asegúrate de que la ruta sea correcta

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Principal />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;