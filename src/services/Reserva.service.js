import api from './api';

const reservaService = {
  crearReserva: async (idSalida, cantidadPersonas, metodoPago, observaciones) => {
    const response = await api.post('/reservas', {
      idSalida,
      cantidadPersonas,
      metodoPago,
      observaciones
    });
    return response.data;
  },

  obtenerMisReservas: async (params = {}) => {
    const response = await api.get('/reservas/mis-reservas', { params });
    return response.data;
  },

  obtenerReservaPorId: async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  cancelarReserva: async (id) => {
    const response = await api.put(`/reservas/${id}/cancelar`);
    return response.data;
  },

  obtenerTodasReservas: async (params = {}) => {
    const response = await api.get('/reservas', { params });
    return response.data;
  },

  completarReserva: async (id) => {
    const response = await api.put(`/reservas/${id}/completar`);
    return response.data;
  }
};

export default reservaService;