import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Excursiones from "./Excursiones";
import Contacto from "./Contacto";
import Experiencias from "./Experiencias";
import Excursionbusqueda from "./Excursionbusqueda";
import Login from "./Login";
import Registro from "./Registro";
import PageReserva from "./PageReserva";
import MisReservas from "./MisReservas";
import Perfil from "./Perfil";
import PanelAdmin from "./PanelAdmin";
import Carrito from "./Carrito";
import Checkout from "./Checkout";
import ProtectedRoute from "../components/ProtectedRoute";

function LayOut() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/excursiones" element={<Excursiones />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/experiencias" element={<Experiencias />} />
      <Route path="/excursionbusqueda/:provincia" element={<Excursionbusqueda />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Rutas protegidas - Usuarios */}
      <Route 
        path="/reserva/:nombreExcursion" 
        element={
          <ProtectedRoute>
            <PageReserva />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/mis-reservas" 
        element={
          <ProtectedRoute>
            <MisReservas />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/carrito" 
        element={
          <ProtectedRoute>
            <Carrito />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } 
      />

      {/* Ruta protegida - Admin */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <PanelAdmin />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default LayOut;