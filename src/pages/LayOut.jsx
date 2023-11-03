import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Excursiones from "./Excursiones";
import Contacto from "./Contacto";
import Experiencias from "./Experiencias";
import Excursionbusqueda from "./Excursionbusqueda"; // Importa Excursionbusqueda
import PageCompra from './PageCompra';

function LayOut() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/excursiones" element={<Excursiones />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/experiencias" element={<Experiencias />} />
      <Route path="/excursionbusqueda/:provincia" element={<Excursionbusqueda />} /> 
      <Route path="/compra/:excu" element={<PageCompra />} /> 
    </Routes>
  );
}

export default LayOut;
