import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import carritoService from '../services/Carrito.service';

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  const { isAuthenticated, usuario } = useAuth();
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cantidadItems, setCantidadItems] = useState(0);

  const isAdmin = usuario?.rol === 'admin';

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      cargarCarrito();
    } else {
      setCarrito(null);
      setCantidadItems(0);
    }
  }, [isAuthenticated, isAdmin]);

  const contarItemsValidos = (carritoData) => {
    if (!carritoData || !carritoData.items || !Array.isArray(carritoData.items)) {
      return 0;
    }

    const itemsValidos = carritoData.items.filter(item => {
      return item && item.salida && item.salida._id;
    });

    return itemsValidos.length;
  };

  const cargarCarrito = async () => {
    if (isAdmin) {
      setCarrito(null);
      setCantidadItems(0);
      return;
    }

    try {
      const data = await carritoService.obtenerCarrito();
      setCarrito(data);
      
      const itemsValidos = contarItemsValidos(data);
      setCantidadItems(itemsValidos);

      console.log('Carrito cargado:', {
        totalItems: data.items?.length || 0,
        itemsValidos: itemsValidos,
        total: data.total
      });

    } catch (error) {
      console.error('Error al cargar carrito:', error);
      setCarrito(null);
      setCantidadItems(0);
    }
  };

  const agregarAlCarrito = async (idSalida, cantidadPersonas) => {
    if (isAdmin) {
      throw new Error('Los administradores no pueden usar el carrito');
    }

    try {
      setLoading(true);
      const data = await carritoService.agregarAlCarrito(idSalida, cantidadPersonas);
      
      console.log('Respuesta agregar al carrito:', data);
      
      setCarrito(data.carrito);
      
      const itemsValidos = contarItemsValidos(data.carrito);
      setCantidadItems(itemsValidos);
      
      return data;
    } catch (error) {
      console.error('Error en agregarAlCarrito:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const actualizarItem = async (idSalida, cantidadPersonas) => {
    if (isAdmin) {
      throw new Error('Los administradores no pueden usar el carrito');
    }

    try {
      const data = await carritoService.actualizarItem(idSalida, cantidadPersonas);
      setCarrito(data.carrito);
      
      const itemsValidos = contarItemsValidos(data.carrito);
      setCantidadItems(itemsValidos);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const eliminarItem = async (idSalida) => {
    if (isAdmin) {
      throw new Error('Los administradores no pueden usar el carrito');
    }

    try {
      const data = await carritoService.eliminarItem(idSalida);
      setCarrito(data.carrito);
      
      const itemsValidos = contarItemsValidos(data.carrito);
      setCantidadItems(itemsValidos);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const vaciarCarrito = async () => {
    if (isAdmin) {
      throw new Error('Los administradores no pueden usar el carrito');
    }

    try {
      const data = await carritoService.vaciarCarrito();
      setCarrito(data.carrito);
      setCantidadItems(0);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const procesarCheckout = async (metodoPago, observaciones) => {
    if (isAdmin) {
      throw new Error('Los administradores no pueden realizar compras');
    }

    try {
      setLoading(true);
      const data = await carritoService.procesarCheckout(metodoPago, observaciones);
      await cargarCarrito();
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    carrito,
    loading,
    cantidadItems,
    isAdmin,
    agregarAlCarrito,
    actualizarItem,
    eliminarItem,
    vaciarCarrito,
    procesarCheckout,
    cargarCarrito
  };

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
};