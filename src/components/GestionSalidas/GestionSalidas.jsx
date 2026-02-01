import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, TextField,
  Grid, Alert, Typography, Chip, Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../services/api';

dayjs.locale('es');

const GestionSalidas = ({ excursion, open, onClose, onUpdate }) => {
  const [salidas, setSalidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [nuevaSalida, setNuevaSalida] = useState({
    fecha: null,
    horario: '9hs',
    capacidadMaxima: 15,
    precioPersona: 0
  });

  useEffect(() => {
    if (open && excursion) {
      cargarSalidas();
      setNuevaSalida({
        fecha: null,
        horario: '9hs',
        capacidadMaxima: 15,
        precioPersona: 0
      });
    }
  }, [open, excursion]);

  const cargarSalidas = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/salidas/excursion/${excursion._id}`);
      setSalidas(response.data);
    } catch (error) {
      console.error('Error al cargar salidas:', error);
      setError('Error al cargar salidas');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearSalida = async () => {
    try {
      setError('');
      setSuccess('');

      if (!nuevaSalida.fecha) {
        setError(' Selecciona una fecha');
        return;
      }

      if (!nuevaSalida.capacidadMaxima || nuevaSalida.capacidadMaxima < 1) {
        setError(' El cupo máximo debe ser al menos 1');
        return;
      }

      if (nuevaSalida.precioPersona === '' || nuevaSalida.precioPersona === null || nuevaSalida.precioPersona === undefined) {
        setError(' El precio por persona es obligatorio');
        return;
      }

      if (parseFloat(nuevaSalida.precioPersona) < 0) {
        setError(' El precio debe ser mayor o igual a 0');
        return;
      }

      const fechaISO = dayjs(nuevaSalida.fecha).format('YYYY-MM-DD');

      const dataToSend = {
        excursion: excursion._id,
        fecha: fechaISO,
        horario: nuevaSalida.horario,
        capacidadMaxima: parseInt(nuevaSalida.capacidadMaxima),
        precioPersona: parseFloat(nuevaSalida.precioPersona)
      };

      console.log('Enviando al backend:', dataToSend);

      await api.post('/salidas', dataToSend);

      setSuccess(' Salida creada con éxito');
      cargarSalidas();
      
      setNuevaSalida({
        fecha: null,
        horario: '9hs',
        capacidadMaxima: 15,
        precioPersona: 0
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error al crear salida:', error);
      
      if (error.response?.data?.mensaje?.includes('Ya existe una salida')) {
        setError(` ${error.response.data.mensaje}`);
      } else if (error.response?.status === 400 && error.response?.data?.mensaje) {
        setError(` ${error.response.data.mensaje}`);
      } else {
        setError(' Error al crear salida. Verifica los datos ingresados.');
      }
    }
  };

  const handleEliminarSalida = async (idSalida) => {
    if (!window.confirm('¿Eliminar esta salida?')) return;

    try {
      await api.delete(`/salidas/${idSalida}`);
      setSuccess(' Salida eliminada');
      cargarSalidas();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al eliminar salida');
    }
  };

  const handleActualizarPrecio = async (idSalida, nuevoPrecio) => {
    try {
      await api.put(`/salidas/${idSalida}`, {
        precioPersona: parseFloat(nuevoPrecio)
      });
      setSuccess(' Precio actualizado');
      cargarSalidas();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(' Error al actualizar precio');
    }
  };

  const handleActualizarCapacidad = async (idSalida, nuevaCapacidad) => {
    try {
      await api.put(`/salidas/${idSalida}`, {
        capacidadMaxima: parseInt(nuevaCapacidad)
      });
      setSuccess(' Capacidad actualizada');
      cargarSalidas();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al actualizar capacidad');
    }
  };

  const formatearFechaParaMostrar = (fechaISO) => {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
    const anio = fecha.getUTCFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Gestionar Salidas: {excursion?.excursion}
      </DialogTitle>
      
      <DialogContent>
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

        <Alert severity="info" sx={{ mb: 3 }}>
          💡 <strong>Importante:</strong> El precio es obligatorio para cada salida y puede ser diferente según la fecha, horario o temporada.
        </Alert>

        <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Crear Nueva Salida
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Fecha *"
                  value={nuevaSalida.fecha}
                  onChange={(newValue) => {
                    setNuevaSalida({ ...nuevaSalida, fecha: newValue });
                  }}
                  format="DD/MM/YYYY"
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputLabelProps: { shrink: true }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Horario *"
                  select
                  fullWidth
                  value={nuevaSalida.horario}
                  onChange={(e) => {
                    setNuevaSalida({ ...nuevaSalida, horario: e.target.value });
                  }}
                  SelectProps={{ native: true }}
                >
                  <option value="9hs">9:00 hs</option>
                  <option value="11hs">11:00 hs</option>
                  <option value="14hs">14:00 hs</option>
                  <option value="16hs">16:00 hs</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Cupo Máximo *"
                  type="number"
                  fullWidth
                  value={nuevaSalida.capacidadMaxima}
                  onChange={(e) => {
                    setNuevaSalida({ ...nuevaSalida, capacidadMaxima: e.target.value });
                  }}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Precio por Persona *"
                  type="number"
                  fullWidth
                  required
                  value={nuevaSalida.precioPersona}
                  onChange={(e) => {
                    setNuevaSalida({ ...nuevaSalida, precioPersona: e.target.value });
                  }}
                  inputProps={{ min: 0, step: 100 }}
                  helperText="Obligatorio - Define el precio para esta salida"
                  error={nuevaSalida.precioPersona === '' || nuevaSalida.precioPersona === null}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  onClick={handleCrearSalida}
                  sx={{ height: '56px' }}
                >
                  Crear
                </Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Paper>

        <Typography variant="h6" gutterBottom>
          Salidas Programadas ({salidas.length})
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography>Cargando...</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Horario</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Cupo Máximo</TableCell>
                  <TableCell>Disponible</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salidas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No hay salidas programadas. Crea la primera.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  salidas.map((salida) => (
                    <TableRow key={salida._id}>
                      <TableCell>
                        {formatearFechaParaMostrar(salida.fecha)}
                      </TableCell>
                      <TableCell>{salida.horario}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={salida.precioPersona || 0}
                          onChange={(e) => {
                            const nuevasSalidas = salidas.map(s => 
                              s._id === salida._id 
                                ? { ...s, precioPersona: e.target.value }
                                : s
                            );
                            setSalidas(nuevasSalidas);
                          }}
                          onBlur={(e) => handleActualizarPrecio(salida._id, e.target.value)}
                          sx={{ width: 120 }}
                          inputProps={{ min: 0, step: 100 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={salida.capacidadMaxima || 0}
                          onChange={(e) => {
                            const nuevasSalidas = salidas.map(s => 
                              s._id === salida._id 
                                ? { ...s, capacidadMaxima: e.target.value }
                                : s
                            );
                            setSalidas(nuevasSalidas);
                          }}
                          onBlur={(e) => handleActualizarCapacidad(salida._id, e.target.value)}
                          sx={{ width: 80 }}
                          inputProps={{ min: 1, max: 100 }}
                        />
                      </TableCell>
                      <TableCell>{salida.disponibilidad || salida.capacidadMaxima}</TableCell>
                      <TableCell>
                        <Chip
                          label={salida.habilitada ? 'Activa' : 'Inactiva'}
                          color={salida.habilitada ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleEliminarSalida(salida._id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GestionSalidas;