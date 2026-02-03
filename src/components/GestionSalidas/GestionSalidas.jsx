import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, TextField,
  Grid, Alert, Typography, Chip, Box, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import api from '../../services/api';

const GestionSalidas = ({ excursion, open, onClose, onUpdate }) => {
  const [salidas, setSalidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form para nueva salida
  const today = new Date().toISOString().split('T')[0];
  const [nuevaSalida, setNuevaSalida] = useState({
    fecha: '',
    horario: '9hs',
    capacidadMaxima: 15,
    precioPersona: 0  // ✅ Siempre inicia en 0
  });

  useEffect(() => {
    if (open && excursion) {
      cargarSalidas();
      setNuevaSalida({
        fecha: '',
        horario: '9hs',
        capacidadMaxima: 15,
        precioPersona: 0  // ✅ Siempre inicia en 0
      });
    }
  }, [open, excursion]);

  const cargarSalidas = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/salidas/excursion/${excursion._id}`);
      console.log('Salidas cargadas:', response.data);
      setSalidas(response.data);
    } catch (error) {
      console.error('Error al cargar salidas:', error);
      setError('Error al cargar salidas');
    } finally {
      setLoading(false);
    }
  };

  const estaVencida = (fecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSalida = new Date(fecha);
    fechaSalida.setHours(0, 0, 0, 0);
    return fechaSalida < hoy;
  };

  const getEstadoSalida = (salida) => {
    if (estaVencida(salida.fecha)) {
      return 'vencida';
    }
    if (salida.disponibilidad === 0) {
      return 'completa';
    }
    return 'disponible';
  };

  const getEstadoChipColor = (estado) => {
    switch (estado) {
      case 'vencida':
        return 'error';
      case 'completa':
        return 'warning';
      case 'disponible':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleCrearSalida = async () => {
    try {
      setError('');
      setSuccess('');

      console.log('Datos a enviar:', nuevaSalida);

      if (!nuevaSalida.fecha) {
        setError('Selecciona una fecha');
        return;
      }

      if (!nuevaSalida.capacidadMaxima || nuevaSalida.capacidadMaxima < 1) {
        setError('El cupo máximo debe ser al menos 1');
        return;
      }

      if (nuevaSalida.precioPersona === '' || nuevaSalida.precioPersona < 0) {
        setError('El precio debe ser mayor o igual a 0');
        return;
      }

      const dataToSend = {
        excursion: excursion._id,
        fecha: nuevaSalida.fecha,
        horario: nuevaSalida.horario,
        capacidadMaxima: parseInt(nuevaSalida.capacidadMaxima),
        precioPersona: parseFloat(nuevaSalida.precioPersona)
      };

      console.log('Enviando al backend:', dataToSend);

      const response = await api.post('/salidas', dataToSend);

      console.log('Respuesta del backend:', response.data);

      setSuccess('Salida creada con éxito');
      cargarSalidas();
      
      // Reset form
      setNuevaSalida({
        fecha: '',
        horario: '9hs',
        capacidadMaxima: 15,
        precioPersona: 0  // ✅ Siempre resetea a 0
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response);
      setError(error.response?.data?.mensaje || 'Error al crear salida');
    }
  };

  const handleEliminarSalida = async (idSalida, salida) => {
    // Verificar si está vencida
    if (estaVencida(salida.fecha)) {
      setError('No se pueden eliminar salidas vencidas');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!window.confirm('¿Eliminar esta salida?')) return;

    try {
      await api.delete(`/salidas/${idSalida}`);
      setSuccess('Salida eliminada');
      cargarSalidas();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al eliminar salida');
    }
  };

  const handleActualizarPrecio = async (idSalida, salida, nuevoPrecio) => {
    // Verificar si está vencida
    if (estaVencida(salida.fecha)) {
      setError('No se pueden modificar salidas vencidas');
      setTimeout(() => setError(''), 3000);
      // Revertir el cambio visualmente
      cargarSalidas();
      return;
    }

    try {
      await api.put(`/salidas/${idSalida}`, {
        precioPersona: parseFloat(nuevoPrecio)
      });
      setSuccess('Precio actualizado');
      cargarSalidas();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error al actualizar precio');
      cargarSalidas();
    }
  };

  const handleActualizarCapacidad = async (idSalida, salida, nuevaCapacidad) => {
    // Verificar si está vencida
    if (estaVencida(salida.fecha)) {
      setError('No se pueden modificar salidas vencidas');
      setTimeout(() => setError(''), 3000);
      // Revertir el cambio visualmente
      cargarSalidas();
      return;
    }

    try {
      await api.put(`/salidas/${idSalida}`, {
        capacidadMaxima: parseInt(nuevaCapacidad)
      });
      setSuccess('Capacidad actualizada');
      cargarSalidas();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al actualizar capacidad');
      cargarSalidas();
    }
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

        {/* FORMULARIO NUEVA SALIDA */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Crear Nueva Salida
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label="Fecha *"
                type="date"
                fullWidth
                value={nuevaSalida.fecha}
                onChange={(e) => {
                  console.log('Fecha seleccionada:', e.target.value);
                  setNuevaSalida({ ...nuevaSalida, fecha: e.target.value });
                }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Horario *"
                select
                fullWidth
                value={nuevaSalida.horario}
                onChange={(e) => {
                  console.log('Horario seleccionado:', e.target.value);
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
                  console.log('Cupo:', e.target.value);
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
                value={nuevaSalida.precioPersona}
                onChange={(e) => {
                  console.log('Precio:', e.target.value);
                  setNuevaSalida({ ...nuevaSalida, precioPersona: e.target.value });
                }}
                inputProps={{ min: 0, step: 100 }}
                placeholder="0"
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
        </Paper>

        {/* TABLA DE SALIDAS */}
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
                  salidas.map((salida) => {
                    const estado = getEstadoSalida(salida);
                    const vencida = estaVencida(salida.fecha);

                    return (
                      <TableRow 
                        key={salida._id}
                        sx={{ 
                          bgcolor: vencida ? '#ffebee' : 'inherit',
                          opacity: vencida ? 0.7 : 1
                        }}
                      >
                        <TableCell>
                          {new Date(salida.fecha).toLocaleDateString('es-AR')}
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
                            onBlur={(e) => {
                              if (!vencida) {
                                handleActualizarPrecio(salida._id, salida, e.target.value);
                              }
                            }}
                            sx={{ width: 120 }}
                            inputProps={{ min: 0, step: 100 }}
                            disabled={vencida}
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
                            onBlur={(e) => {
                              if (!vencida) {
                                handleActualizarCapacidad(salida._id, salida, e.target.value);
                              }
                            }}
                            sx={{ width: 80 }}
                            inputProps={{ min: 1, max: 100 }}
                            disabled={vencida}
                          />
                        </TableCell>
                        <TableCell>{salida.disponibilidad || salida.capacidadMaxima}</TableCell>
                        <TableCell>
                          <Chip
                            label={estado.toUpperCase()}
                            color={getEstadoChipColor(estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {vencida ? (
                            <Tooltip title="No se pueden modificar/eliminar salidas vencidas">
                              <span>
                                <IconButton size="small" disabled>
                                  <BlockIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          ) : (
                            <IconButton
                              color="error"
                              onClick={() => handleEliminarSalida(salida._id, salida)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Info box */}
        <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>ℹ️ Nota:</strong> Las salidas con fecha pasada se marcan automáticamente como "VENCIDA" 
            y no pueden ser modificadas ni eliminadas.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GestionSalidas;