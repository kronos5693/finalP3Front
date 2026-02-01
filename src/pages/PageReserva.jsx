import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Card, CardContent, Typography, CardMedia, 
  Grid, Paper, Button, Alert, CircularProgress, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import api from '../services/api';
import salidaService from '../services/Salida.service';
import NavBar from '../components/NavBar/navBar';

const PageReserva = () => {
  const { nombreExcursion } = useParams();
  const { usuario, isAuthenticated } = useAuth();
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  const [excursion, setExcursion] = useState(null);
  const [salidas, setSalidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [cantidadDialog, setCantidadDialog] = useState(false);
  const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    cargarDatos();
  }, [nombreExcursion, isAuthenticated]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const excursionData = await api.get(`/excursiones/nombre/${nombreExcursion}`);
      setExcursion(excursionData.data);

      const salidasData = await salidaService.obtenerSalidasPorExcursion(
        excursionData.data._id,
        { futuras: 'true', habilitadas: 'true' }
      );
      setSalidas(salidasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError(error.response?.data?.mensaje || 'Error al cargar la excursión');
    } finally {
      setLoading(false);
    }
  };

  const abrirDialogoCantidad = (salida) => {
    setSalidaSeleccionada(salida);
    setCantidadPersonas(1);
    setSubtotal(salida.precioPersona || 0);
    setCantidadDialog(true);
  };

  const actualizarCantidad = (nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    if (nuevaCantidad > (salidaSeleccionada?.disponibilidad || 1)) return;
    
    setCantidadPersonas(nuevaCantidad);
    setSubtotal(nuevaCantidad * (salidaSeleccionada?.precioPersona || 0));
  };

  const handleAgregarAlCarrito = async () => {
    if (!salidaSeleccionada) return;
    
    try {
      await agregarAlCarrito(salidaSeleccionada._id, cantidadPersonas);
      setSuccess(`¡Agregado al carrito! ${cantidadPersonas} persona(s) para la salida del ${salidaSeleccionada.horario}`);
      setCantidadDialog(false);
      
      setSalidas(salidas.map(salida => 
        salida._id === salidaSeleccionada._id 
          ? { ...salida, disponibilidad: salida.disponibilidad - cantidadPersonas }
          : salida
      ));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al agregar al carrito');
      setCantidadDialog(false);
    }
  };

  const horarioANumero = (horario) => {
    const numero = parseInt(horario.replace('hs', ''));
    return numero;
  };

  const agruparSalidasPorFecha = () => {
    const agrupadas = {};
    
    salidas.forEach(salida => {
      const fecha = new Date(salida.fecha);
      const dia = String(fecha.getUTCDate()).padStart(2, '0');
      const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
      const anio = fecha.getUTCFullYear();
      
      const nombreDia = fecha.toLocaleDateString('es-AR', { 
        weekday: 'long',
        timeZone: 'UTC'
      });
      const nombreMes = fecha.toLocaleDateString('es-AR', { 
        month: 'long',
        timeZone: 'UTC'
      });
      
      const textoFecha = `${nombreDia}, ${dia} de ${nombreMes} de ${anio}`;
      
      if (!agrupadas[textoFecha]) {
        agrupadas[textoFecha] = [];
      }
      agrupadas[textoFecha].push(salida);
    });
    
    Object.keys(agrupadas).forEach(fecha => {
      agrupadas[fecha].sort((a, b) => {
        return horarioANumero(a.horario) - horarioANumero(b.horario);
      });
    });
    
    return agrupadas;
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (error && !excursion) {
    return (
      <>
        <NavBar />
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button onClick={() => navigate('/excursiones')} sx={{ mt: 2 }}>
            Volver a Excursiones
          </Button>
        </Container>
      </>
    );
  }

  if (!excursion) {
    return (
      <>
        <NavBar />
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">Excursión no encontrada</Alert>
          <Button onClick={() => navigate('/excursiones')} sx={{ mt: 2 }}>
            Volver a Excursiones
          </Button>
        </Container>
      </>
    );
  }

  const salidasAgrupadas = agruparSalidasPorFecha();

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%'
            }}>
              <CardMedia
                component="img"
                image={excursion.img}
                alt={excursion.excursion}
                sx={{ 
                  height: 400, 
                  width: '100%',
                  objectFit: 'cover' 
                }}
              />
              <CardContent sx={{ 
                textAlign: 'center', 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: 3
              }}>
                <Typography variant="h4" gutterBottom>
                  {excursion.excursion}
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    textAlign: 'justify',
                    maxWidth: '90%',
                    mb: 2
                  }}
                >
                  {excursion.descripcion}
                </Typography>
                {/*<Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  Precio: Desde ${excursion.precio || 'Consultar'}
                </Typography>*/}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ShoppingCartIcon sx={{ mr: 1 }} />
                <Typography variant="h5">
                  Salidas Disponibles
                </Typography>
              </Box>

              {salidas.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No hay salidas disponibles en este momento. Por favor, contacta con nosotros.
                </Alert>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {Object.entries(salidasAgrupadas).map(([fecha, salidasDelDia]) => (
                    <Box key={fecha} sx={{ mb: 4 }}>
                      <Typography variant="h6" color="primary" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
                        📅 {fecha}
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Horario</TableCell>
                              <TableCell align="center">Disponibilidad</TableCell>
                              <TableCell align="center">Precio c/u</TableCell>
                              <TableCell align="center">Acción</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {salidasDelDia.map((salida) => (
                              <TableRow 
                                key={salida._id}
                                sx={{ 
                                  '&:hover': { backgroundColor: 'action.hover' },
                                  opacity: salida.disponibilidad === 0 ? 0.6 : 1
                                }}
                              >
                                <TableCell>
                                  <Typography variant="body2" fontWeight="medium">
                                    🕐 {salida.horario}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Box>
                                    <Typography variant="body2">
                                      {salida.disponibilidad} / {salida.capacidadMaxima}
                                    </Typography>
                                    {salida.disponibilidad === 0 && (
                                      <Typography variant="caption" color="error" display="block">
                                        AGOTADO
                                      </Typography>
                                    )}
                                    {salida.disponibilidad > 0 && salida.disponibilidad <= 3 && (
                                      <Typography variant="caption" color="warning.main" display="block">
                                        ÚLTIMOS {salida.disponibilidad} LUGARES
                                      </Typography>
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography variant="body2" fontWeight="medium">
                                    ${salida.precioPersona || 0}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => abrirDialogoCantidad(salida)}
                                    disabled={salida.disponibilidad === 0}
                                    startIcon={<ShoppingCartIcon />}
                                  >
                                    Reservar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  ))}
                </Box>
              )}

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.300' }}>
                <Typography variant="body2" color="text.secondary">
                  💡 <strong>Instrucciones:</strong> Selecciona una salida, elige la cantidad de personas y agrégala a tu carrito. 
                  Puedes reservar múltiples salidas y finalizar la compra desde el carrito.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Dialog 
          open={cantidadDialog} 
          onClose={() => setCantidadDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            Seleccionar cantidad de personas
          </DialogTitle>
          <DialogContent>
            {salidaSeleccionada && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  Salida: {salidaSeleccionada.horario} - {new Date(salidaSeleccionada.fecha).toLocaleDateString('es-AR')}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Disponibilidad: {salidaSeleccionada.disponibilidad} lugares
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 3 }}>
                  <IconButton 
                    onClick={() => actualizarCantidad(cantidadPersonas - 1)}
                    disabled={cantidadPersonas <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  
                  <TextField
                    type="number"
                    value={cantidadPersonas}
                    onChange={(e) => actualizarCantidad(parseInt(e.target.value) || 1)}
                    inputProps={{ 
                      min: 1, 
                      max: salidaSeleccionada.disponibilidad,
                      style: { textAlign: 'center', fontSize: '1.5rem', width: '80px' }
                    }}
                    variant="outlined"
                    sx={{ mx: 2 }}
                  />
                  
                  <IconButton 
                    onClick={() => actualizarCantidad(cantidadPersonas + 1)}
                    disabled={cantidadPersonas >= salidaSeleccionada.disponibilidad}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                  <Typography variant="h6" align="center" gutterBottom>
                    Detalle
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Precio unitario:</Typography>
                    <Typography>${salidaSeleccionada.precioPersona || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Cantidad:</Typography>
                    <Typography>{cantidadPersonas} persona(s)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pt: 1, borderTop: '1px solid' }}>
                    <Typography variant="h6">Subtotal:</Typography>
                    <Typography variant="h6" color="primary">
                      ${subtotal}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCantidadDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={handleAgregarAlCarrito}
              disabled={!cantidadPersonas || cantidadPersonas < 1}
            >
              Agregar al carrito
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default PageReserva;