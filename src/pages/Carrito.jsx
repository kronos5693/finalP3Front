import React from 'react';
import {
  Container, Paper, Typography, Box, Button, Card, CardContent,
  IconButton, Alert, CircularProgress, Divider, Grid
} from '@mui/material';
import NavBar from '../components/NavBar/navBar';
import { useCarrito } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Carrito = () => {
  const { carrito, loading, eliminarItem, actualizarItem, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  //  DEBUG: Ver qué llega del backend
  React.useEffect(() => {
    if (carrito) {
      console.log('🛒 Carrito completo:', carrito);
      console.log('💰 Total del backend:', carrito.total);
      console.log('📦 Items:', carrito.items);
    }
  }, [carrito]);

  const handleEliminar = async (idSalida) => {
    try {
      setError('');
      await eliminarItem(idSalida);
      setSuccess('Item eliminado del carrito');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al eliminar item');
    }
  };

  const handleActualizarCantidad = async (idSalida, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    try {
      setError('');
      await actualizarItem(idSalida, nuevaCantidad);
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al actualizar cantidad');
    }
  };

  const handleVaciar = async () => {
    if (!window.confirm('¿Estás seguro de vaciar el carrito?')) return;

    try {
      setError('');
      await vaciarCarrito();
      setSuccess('Carrito vaciado');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al vaciar carrito');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  const items = carrito?.items || [];
  
  //  CALCULAR SUBTOTALES Y TOTAL LOCALMENTE
  const calcularSubtotal = (item) => {
    
    const precio = item.salida?.precioPersona || item.precioUnitario || item.salida?.excursion?.precio || 0;
    const subtotal = item.cantidadPersonas * precio;
    console.log(`📊 Item: ${item.salida?.excursion?.excursion} - Precio: ${precio} x ${item.cantidadPersonas} = ${subtotal}`);
    return subtotal;
  };

  const totalGeneral = items.reduce((sum, item) => {
    return sum + calcularSubtotal(item);
  }, 0);

  console.log('💵 TOTAL CALCULADO LOCALMENTE:', totalGeneral);

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <ShoppingCartIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4">
            Mi Carrito
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {items.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Tu carrito está vacío
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/excursiones')}
            >
              Explorar Excursiones
            </Button>
          </Paper>
        ) : (
          <>
            <Paper sx={{ mb: 3 }}>
              {items.map((item, index) => {
                const subtotal = calcularSubtotal(item);
                
                return (
                  <Box key={item._id || index}>
                    <Card variant="outlined" sx={{ m: 2 }}>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={6}>
                            <Typography variant="h6">
                              {item.salida?.excursion?.excursion || 'Excursión'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Fecha: {item.salida?.fecha 
                                ? new Date(item.salida.fecha).toLocaleDateString('es-AR')
                                : 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Horario: {item.salida?.horario || 'N/A'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Box display="flex" alignItems="center" justifyContent="center">
                              <IconButton
                                size="small"
                                onClick={() => handleActualizarCantidad(
                                  item.salida._id, 
                                  item.cantidadPersonas - 1
                                )}
                                disabled={item.cantidadPersonas <= 1}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <Typography sx={{ mx: 2 }}>
                                {item.cantidadPersonas} {item.cantidadPersonas === 1 ? 'persona' : 'personas'}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleActualizarCantidad(
                                  item.salida._id, 
                                  item.cantidadPersonas + 1
                                )}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={2}>
                            <Typography variant="h6" align="center">
                              ${subtotal}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={1}>
                            <IconButton
                              color="error"
                              onClick={() => handleEliminar(item.salida._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    {index < items.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">
                  Total:
                </Typography>
                <Typography variant="h4" color="primary">
                  ${totalGeneral}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" gap={2} justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleVaciar}
                >
                  Vaciar Carrito
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCheckout}
                >
                  Proceder al Checkout
                </Button>
              </Box>
            </Paper>
          </>
        )}
      </Container>
    </>
  );
};

export default Carrito;