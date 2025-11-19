import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar/navBar';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  CardContent,
  Typography,
  CardMedia,
  Card,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  Alert,
} from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PageCompra = () => {
  const { excu } = useParams();
  const { usuario, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const apiUrl = `/excursiones/${excu}`;
  const [post, setPost] = useState({});
  const [disponibilidad, setDisponibilidad] = useState(1);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [compra, setCompra] = useState({
    fecha: today,
    personas: 1,
    precio: 0,
    total: 0,
    horario: '',
  });

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    api
      .get(apiUrl)
      .then((response) => {
        const data = response.data;
        console.log('Datos de la base de datos:', data);
        setPost(data);

        const nuevoPrecio = parseFloat(data.precio);
        setCompra((prevCompra) => ({
          ...prevCompra,
          precio: nuevoPrecio,
          total: nuevoPrecio * disponibilidad,
        }));

        if (data.horarios && data.horarios.length > 0) {
          setHorarioSeleccionado(data.horarios[0].turno);
          setCompra((prevCompra) => ({
            ...prevCompra,
            horario: data.horarios[0].turno,
          }));
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
        setError('Error al cargar la excursión');
      });
  }, [apiUrl, isAuthenticated, navigate]);

  const handleDisponibilidadChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue) && newValue >= 1) {
      setDisponibilidad(newValue);
      setCompra((prevCompra) => ({
        ...prevCompra,
        personas: newValue,
        total: parseFloat(post.precio) * newValue,
      }));
    }
  };

  const handleHorarioChange = (event) => {
    const newHorario = event.target.value;
    setHorarioSeleccionado(newHorario);
    setCompra((prevCompra) => ({
      ...prevCompra,
      horario: newHorario,
    }));
  };

  const handleCompra = async () => {
    if (!isAuthenticated || !usuario) {
      setError('Debes iniciar sesión para realizar una compra');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const compraData = {
      idUsuario: usuario.id,  // Usar el ID del usuario autenticado
      idExcursion: post._id,
      cantidadPersonas: compra.personas,
      fechaCompra: new Date(),
      fechaExcursion: compra.fecha,
      turnoExcursion: compra.horario,
      totalPagado: compra.total,
    };

    try {
      const response = await api.post('/compra/', compraData);
      console.log('Compra realizada con éxito:', response.data);
      setSuccess('¡Compra realizada con éxito!');
      
      // Esperar un momento antes de recargar
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      
      if (error.response) {
        setError(error.response.data.mensaje || 'Error al realizar la compra');
        console.error('Respuesta del servidor:', error.response.data);
      } else if (error.request) {
        setError('No se recibió respuesta del servidor');
      } else {
        setError('Error al procesar la compra');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!post.excursion) {
    return (
      <>
        <NavBar />
        <Container>
          <Typography>La excursión no se encuentra en la base de datos.</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Container maxWidth="xl">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ maxWidth: 600, height: '100%' }}>
                <CardMedia
                  sx={{ width: '100%', paddingTop: '56.25%' }}
                  image={post.img}
                  title={post.excursion}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {post.excursion}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.descripcion}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    Precio: ${post.precio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Selección de Fecha
                  </Typography>
                  <TextField
                    id="fecha"
                    label="Fecha de Excursión"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    inputProps={{ min: today }}
                    value={compra.fecha}
                    onChange={(event) => setCompra({ ...compra, fecha: event.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                  <Typography variant="h6" gutterBottom>
                    Número de Personas
                  </Typography>
                  <TextField
                    id="disponibilidad"
                    label="Número de Personas"
                    type="number"
                    value={disponibilidad}
                    onChange={handleDisponibilidadChange}
                    fullWidth
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                  <Typography variant="h6" gutterBottom>
                    Horario de Excursión
                  </Typography>
                  <TextField
                    id="horario"
                    label="Horario de Excursión"
                    value={horarioSeleccionado}
                    onChange={handleHorarioChange}
                    fullWidth
                    select
                  >
                    {post.horarios &&
                      post.horarios.map((horario) => (
                        <MenuItem key={horario.turno} value={horario.turno}>
                          {horario.turno} ({horario.disponibilidad} disponibles)
                        </MenuItem>
                      ))}
                  </TextField>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                  <Typography variant="h6" gutterBottom>
                    Total a Pagar: ${compra.total}
                  </Typography>
                </div>
                <Button 
                  variant="contained" 
                  color="primary" 
                  style={{ marginTop: '20px' }} 
                  onClick={handleCompra}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Comprar Excursión'}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default PageCompra;
