import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Card, CardContent, CardMedia, 
  Grid, Chip, Button, Alert, CircularProgress, Tabs, Tab, Paper
} from '@mui/material';
import NavBar from '../components/NavBar/navBar';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import reservaService from '../services/Reserva.service';

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reservaService.obtenerMisReservas();
      console.log('Reservas cargadas:', data);
      setReservas(data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setError(error.response?.data?.mensaje || 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) return;

    try {
      await reservaService.cancelarReserva(id);
      setSuccess('Reserva cancelada exitosamente');
      setTimeout(() => setSuccess(''), 3000);
      cargarReservas();
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al cancelar reserva');
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      confirmada: 'success',
      cancelada: 'error',
      completada: 'info'
    };
    return colores[estado] || 'default';
  };

  const filtrarReservas = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    switch (tabValue) {
      case 0: // Todas
        return reservas;
      case 1: // Próximas
        return reservas.filter(r => 
          r.estado === 'confirmada' && 
          r.salida?.fecha && 
          new Date(r.salida.fecha) >= hoy
        );
      case 2: // Pasadas
        return reservas.filter(r => 
          r.salida?.fecha && 
          new Date(r.salida.fecha) < hoy
        );
      case 3: // Canceladas
        return reservas.filter(r => r.estado === 'cancelada');
      default:
        return reservas;
    }
  };

  const reservasFiltradas = filtrarReservas();

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

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mis Reservas
        </Typography>

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

        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab label={`Todas (${reservas.length})`} />
            <Tab label="Próximas" />
            <Tab label="Pasadas" />
            <Tab label="Canceladas" />
          </Tabs>
        </Paper>

        {reservasFiltradas.length === 0 ? (
          <Alert severity="info">
            {tabValue === 0 
              ? 'No tienes reservas todavía. ¡Explora nuestras excursiones!'
              : 'No hay reservas en esta categoría.'}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {reservasFiltradas.map((reserva) => (
              <Grid item xs={12} md={6} key={reserva._id}>
                <Card>
                  {reserva.salida?.excursion?.img && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={reserva.salida.excursion.img}
                      alt={reserva.salida.excursion.excursion}
                    />
                  )}
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h5" component="div">
                        {reserva.salida?.excursion?.excursion || 'Excursión'}
                      </Typography>
                      <Chip 
                        label={reserva.estado} 
                        color={getEstadoColor(reserva.estado)}
                        size="small"
                      />
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <EventIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        Fecha: {reserva.salida?.fecha 
                          ? new Date(reserva.salida.fecha).toLocaleDateString('es-AR')
                          : 'N/A'}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <AccessTimeIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        Horario: {reserva.salida?.horario || 'N/A'}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <PeopleIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        Personas: {reserva.cantidadPersonas}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <AttachMoneyIcon color="action" fontSize="small" />
                      <Typography variant="body2" fontWeight="bold">
                        Total: ${reserva.totalPagado}
                      </Typography>
                    </Box>

                    {reserva.metodoPago && (
                      <Typography variant="caption" display="block" color="text.secondary" mb={1}>
                        Método de pago: {reserva.metodoPago}
                      </Typography>
                    )}

                    {reserva.observaciones && (
                      <Typography variant="caption" display="block" color="text.secondary" mb={2}>
                        Observaciones: {reserva.observaciones}
                      </Typography>
                    )}

                    {reserva.estado === 'confirmada' && 
                     reserva.salida?.fecha && 
                     new Date(reserva.salida.fecha) >= new Date() && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CancelIcon />}
                        onClick={() => handleCancelar(reserva._id)}
                        fullWidth
                      >
                        Cancelar Reserva
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default MisReservas;