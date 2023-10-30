import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Excursiones from "./Excursiones";
import Contacto from "./Contacto";
import Experiencias from "./Experiencias";

import Excursionbusqueda from "./Excursionbusqueda";

function LayOut() {
  return (
    <>

    
      <Routes>
        
        <Route path="/" element={<Home />}></Route>
        <Route path="/excursiones" element={<Excursiones />}></Route>
        <Route path="/contacto" element={<Contacto />}></Route>
        <Route path="/experiencias" element={<Experiencias />}></Route>
        <Route path="/excursionbusqueda" element={<Excursionbusqueda />} ></Route>
    
    
      </Routes>
    </>
  
  )
}

export default LayOut