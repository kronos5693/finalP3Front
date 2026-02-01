import api from './api';

const carritoService = {
  obtenerCarrito: async () => {
    const response = await api.get('/carrito');
    return response.data;
  },

  agregarAlCarrito: async (idSalida, cantidadPersonas) => {
    const response = await api.post('/carrito/agregar', { 
      idSalida, 
      cantidadPersonas 
    });
    return response.data;
  },

  actualizarItem: async (idSalida, cantidadPersonas) => {
    const response = await api.put('/carrito/actualizar', { 
      idSalida, 
      cantidadPersonas 
    });
    return response.data;
  },

  eliminarItem: async (idSalida) => {
    const response = await api.delete(`/carrito/eliminar/${idSalida}`);
    return response.data;
  },

  vaciarCarrito: async () => {
    const response = await api.delete('/carrito/vaciar');
    return response.data;
  },

  procesarCheckout: async (metodoPago = 'efectivo', observaciones = '') => {
    const response = await api.post('/carrito/checkout', {
      metodoPago,
      observaciones
    });
    return response.data;
  }
};

export default carritoService;