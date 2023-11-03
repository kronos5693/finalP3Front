import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Excursiones from "./Excursiones";
import Contacto from "./Contacto";
import Experiencias from "./Experiencias";
import Excursionbusqueda from "./Excursionbusqueda"; // Importa Excursionbusqueda

function LayOut() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/excursiones" element={<Excursiones />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/experiencias" element={<Experiencias />} />
      <Route path="/excursionbusqueda/:provincia" element={<Excursionbusqueda />} /> {/* Define una ruta que toma la provincia como parámetro */}
    </Routes>
  );
}

export default LayOut;
