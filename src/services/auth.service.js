import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        contraseña: password
      });

      if (response.data.token) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      }

      return response.data;
    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error.response) {
        // El servidor respondió con un código de error
        throw new Error(error.response.data.mensaje || 'Error al iniciar sesión');
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        throw new Error('No se pudo conectar con el servidor');
      } else {
        // Algo pasó al configurar la petición
        throw new Error('Error al procesar la solicitud');
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // Método para verificar si el token sigue siendo válido
  async verificarAuth() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await axios.get(`${API_URL}/verificar`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data.autenticado;
    } catch (error) {
      this.logout();
      return false;
    }
  }
}

export default new AuthService();