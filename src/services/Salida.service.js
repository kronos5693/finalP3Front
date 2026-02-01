import api from './api';

const salidaService = {
  obtenerSalidas: async (params = {}) => {
    const response = await api.get('/salidas', { params });
    return response.data;
  },

  obtenerSalidaPorId: async (id) => {
    const response = await api.get(`/salidas/${id}`);
    return response.data;
  },

  obtenerSalidasPorExcursion: async (idExcursion, params = {}) => {
    const response = await api.get(`/salidas/excursion/${idExcursion}`, { params });
    return response.data;
  },

  crearSalida: async (salidaData) => {
    const response = await api.post('/salidas', salidaData);
    return response.data;
  },

  editarSalida: async (id, salidaData) => {
    const response = await api.put(`/salidas/${id}`, salidaData);
    return response.data;
  },

  eliminarSalida: async (id) => {
    const response = await api.delete(`/salidas/${id}`);
    return response.data;
  },

  verificarDisponibilidad: async (id, cantidadPersonas) => {
    const response = await api.get(`/salidas/${id}/disponibilidad`, {
      params: { cantidadPersonas }
    });
    return response.data;
  }
};

export default salidaService;