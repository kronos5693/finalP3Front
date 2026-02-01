import React, { useState } from 'react';
import {
  Container, Paper, Typography, Box, Button, TextField,
  RadioGroup, FormControlLabel, Radio, Alert, CircularProgress,
  Divider, Grid, Card, CardContent
} from '@mui/material';
import NavBar from '../components/NavBar/navBar';
import { useCarrito } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Checkout = () => {
  const { carrito, procesarCheckout, loading } = useCarrito();
  const navigate = useNavigate();
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  const items = carrito?.items || [];
 const totalGeneral = carrito?.total || 0;

  const handleConfirmar = async () => {
    try {
      setError('');
      setProcesando(true);

      await procesarCheckout(metodoPago, observaciones);

      // Redirigir a mis reservas
      navigate('/mis-reservas');
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al procesar la compra');
      setProcesando(false);
    }
  };

  if (loading || !carrito) {
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

  if (items.length === 0) {
    return (
      <>
        <NavBar />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="warning">
            Tu carrito está vacío. No hay nada que procesar.
          </Alert>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/excursiones')}
          >
            Ir a Excursiones
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <PaymentIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4">
            Checkout
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Resumen del pedido */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resumen del Pedido
              </Typography>
              <Divider sx={{ my: 2 }} />

              {items.map((item, index) => (
                <Box key={item._id || index} mb={2}>
                  <Typography variant="subtitle1">
                    {item.salida?.excursion?.excursion || 'Excursión'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha: {item.salida?.fecha 
                      ? new Date(item.salida.fecha).toLocaleDateString('es-AR')
                      : 'N/A'} - Horario: {item.salida?.horario || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.cantidadPersonas} {item.cantidadPersonas === 1 ? 'persona' : 'personas'} × ${item.salida?.excursion?.precio || 0} = ${item.subtotal}
                  </Typography>
                  {index < items.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${totalGeneral}
                </Typography>
              </Box>
            </Paper>

            {/* Observaciones */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Observaciones (opcional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Agrega cualquier comentario o solicitud especial..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </Paper>
          </Grid>

          {/* Método de pago */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Método de Pago
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <RadioGroup
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <FormControlLabel 
                  value="efectivo" 
                  control={<Radio />} 
                  label="Efectivo"
                />
                <FormControlLabel 
                  value="tarjeta_credito" 
                  control={<Radio />} 
                  label="Tarjeta de Crédito"
                />
                <FormControlLabel 
                  value="tarjeta_debito" 
                  control={<Radio />} 
                  label="Tarjeta de Débito"
                />
                <FormControlLabel 
                  value="transferencia" 
                  control={<Radio />} 
                  label="Transferencia Bancaria"
                />
              </RadioGroup>
            </Paper>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={procesando ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
              onClick={handleConfirmar}
              disabled={procesando}
            >
              {procesando ? 'Procesando...' : 'Confirmar Compra'}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/carrito')}
              disabled={procesando}
            >
              Volver al Carrito
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Checkout;