import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const apiUrl = "http://localhost:3000/usuarios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',  
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Limpiar error al escribir
  };

  const validateForm = () => {
    // Validar que todos los campos estén completos
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos obligatorios');
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const dataToSend = {
      nombre: formData.firstName,
      apellido: formData.lastName,
      contraseña: formData.password,
      email: formData.email,
    };

    try {
      // Enviar los datos a la API
      const response = await axios.post(apiUrl, dataToSend);
      console.log('Usuario creado correctamente:', response.data);
      
      setSuccess('¡Registro exitoso! Iniciando sesión...');
      
      // Hacer login automático después del registro
      setTimeout(async () => {
        try {
          await login(formData.email, formData.password);
          navigate('/');
        } catch (loginError) {
          console.error('Error al hacer login automático:', loginError);
          setError('Usuario creado, pero hubo un error al iniciar sesión. Por favor inicia sesión manualmente.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      }, 1000);

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      
      if (error.response) {
        // El servidor respondió con un error
        setError(error.response.data.mensaje || 'Error al registrar usuario');
        
        // Mostrar errores específicos si existen
        if (error.response.data.errores) {
          const errores = error.response.data.errores.join(', ');
          setError(`Error: ${errores}`);
        }
      } else if (error.request) {
        setError('No se pudo conectar con el servidor');
      } else {
        setError('Error al procesar el registro');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '60px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'white'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Crear Cuenta
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '20px' }}>
          {error && (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" style={{ marginBottom: '16px' }}>
              {success}
            </Alert>
          )}

          <TextField
            name="firstName"
            label="Nombre *"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            autoComplete="given-name"
          />
          
          <TextField
            name="lastName"
            label="Apellido *"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            autoComplete="family-name"
          />
          
          <TextField
            name="phoneNumber"
            label="Teléfono (opcional)"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={loading}
            autoComplete="tel"
          />
          
          <TextField
            name="email"
            label="Correo Electrónico *"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            autoComplete="email"
          />
          
          <TextField
            name="password"
            label="Contraseña *"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            autoComplete="new-password"
            helperText="Mínimo 6 caracteres"
          />
        
          <TextField
            name="confirmPassword"
            label="Repetir Contraseña *"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            autoComplete="new-password"
          />
          
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            fullWidth
            disabled={loading}
            style={{ 
              marginTop: '20px',
              padding: '12px',
              fontSize: '16px'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>

          <Box sx={{ textAlign: 'center', marginTop: 2 }}>
            <Typography variant="body2">
              ¿Ya tienes cuenta? {' '}
              <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Inicia sesión aquí
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default SignUp;
