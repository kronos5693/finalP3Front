import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Tabs, Tab, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, CircularProgress, IconButton, Chip, Grid, InputAdornment
} from '@mui/material';
import NavBar from '../components/NavBar/navBar';
import GestionSalidas from '../components/GestionSalidas/GestionSalidas';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventIcon from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';

const PanelAdmin = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para excursiones
  const [excursiones, setExcursiones] = useState([]);
  const [busquedaExcursion, setBusquedaExcursion] = useState('');
  const [openExcursionDialog, setOpenExcursionDialog] = useState(false);
  const [excursionForm, setExcursionForm] = useState({
    excursion: '',
    provincia: '',
    localidad: '',
    descripcion: '',
    img: '',
    habilitadaPorTemporada: true
  });

  // Estados para gestión de salidas
  const [openSalidasDialog, setOpenSalidasDialog] = useState(false);
  const [excursionSeleccionada, setExcursionSeleccionada] = useState(null);

  // Estados para usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [openUsuarioDialog, setOpenUsuarioDialog] = useState(false);
  const [usuarioForm, setUsuarioForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contraseña: '',
    rol: 'usuario'
  });

  // Verificar si es admin
  useEffect(() => {
    if (usuario?.rol !== 'admin') {
      navigate('/');
    }
  }, [usuario, navigate]);

  useEffect(() => {
    if (tabValue === 0) {
      cargarExcursiones();
    } else if (tabValue === 1) {
      cargarUsuarios();
    }
  }, [tabValue]);

  // ========================================
  // FUNCIONES EXCURSIONES
  // ========================================

  const cargarExcursiones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/excursiones');
      setExcursiones(response.data);
    } catch (error) {
      setError('Error al cargar excursiones');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // FILTRAR EXCURSIONES POR BÚSQUEDA
  const excursionesFiltradas = excursiones.filter((exc) => {
    const busqueda = busquedaExcursion.toLowerCase();
    return (
      exc.excursion.toLowerCase().includes(busqueda) ||
      exc.provincia.toLowerCase().includes(busqueda) ||
      exc.localidad.toLowerCase().includes(busqueda)
    );
  });

  const handleCrearExcursion = async () => {
    try {
      setError('');
      setSuccess('');

      if (!excursionForm.excursion || !excursionForm.provincia || !excursionForm.localidad) {
        setError('Completa todos los campos obligatorios');
        return;
      }

      await api.post('/excursiones', excursionForm);

      setSuccess('Excursión creada con éxito. Ahora crea las salidas y configura los precios.');
      setOpenExcursionDialog(false);
      cargarExcursiones();
      resetExcursionForm();
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al crear excursión');
    }
  };

  const handleEliminarExcursion = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta excursión?')) return;

    try {
      await api.delete(`/excursiones/${id}`);
      setSuccess('Excursión eliminada');
      cargarExcursiones();
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al eliminar excursión');
    }
  };

  const handleGestionarSalidas = (excursion) => {
    setExcursionSeleccionada(excursion);
    setOpenSalidasDialog(true);
  };

  const resetExcursionForm = () => {
    setExcursionForm({
      excursion: '',
      provincia: '',
      localidad: '',
      descripcion: '',
      img: '',
      habilitadaPorTemporada: true
    });
  };

  // ========================================
  // FUNCIONES USUARIOS
  // ========================================

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      setError('Error al cargar usuarios');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearUsuario = async () => {
    try {
      setError('');
      setSuccess('');

      if (!usuarioForm.nombre || !usuarioForm.apellido || !usuarioForm.email || !usuarioForm.contraseña) {
        setError('Completa todos los campos obligatorios');
        return;
      }

      if (usuarioForm.contraseña.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      // Buscar el rol
      const rolesResponse = await api.get('/roles');
      const roles = rolesResponse.data;
      const rolSeleccionado = roles.find(r => r.nombre === usuarioForm.rol);

      await api.post('/usuarios', {
        nombre: usuarioForm.nombre,
        apellido: usuarioForm.apellido,
        email: usuarioForm.email,
        contraseña: usuarioForm.contraseña,
        rol: rolSeleccionado?._id
      });

      setSuccess(`${usuarioForm.rol === 'admin' ? 'Administrador' : 'Usuario'} creado con éxito`);
      setOpenUsuarioDialog(false);
      cargarUsuarios();
      resetUsuarioForm();
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al crear usuario');
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await api.delete(`/usuarios/${id}`);
      setSuccess('Usuario eliminado');
      cargarUsuarios();
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al eliminar usuario');
    }
  };

  const resetUsuarioForm = () => {
    setUsuarioForm({
      nombre: '',
      apellido: '',
      email: '',
      contraseña: '',
      rol: 'usuario'
    });
  };

  // ========================================
  // RENDER
  // ========================================

  if (loading && excursiones.length === 0 && usuarios.length === 0) {
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
          Panel de Administración
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
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Excursiones" />
            <Tab label="Usuarios" />
          </Tabs>
        </Paper>

        {/* TAB EXCURSIONES */}
        {tabValue === 0 && (
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5">Gestión de Excursiones</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenExcursionDialog(true)}
              >
                Nueva Excursión
              </Button>
            </Box>

            {/* ALERT INFORMATIVO 
            <Alert severity="info" sx={{ mb: 3 }}>
              💡 Los precios se configuran individualmente en cada salida usando el botón 📅
            </Alert> */}

            {/* BUSCADOR DE EXCURSIONES */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Buscar excursión por nombre, provincia o localidad..."
                value={busquedaExcursion}
                onChange={(e) => setBusquedaExcursion(e.target.value)}
                variant="outlined"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {busquedaExcursion && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Mostrando {excursionesFiltradas.length} de {excursiones.length} excursiones
                </Typography>
              )}
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Provincia</TableCell>
                    <TableCell>Localidad</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {excursionesFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          {busquedaExcursion 
                            ? 'No se encontraron excursiones que coincidan con la búsqueda' 
                            : 'No hay excursiones registradas'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    excursionesFiltradas.map((exc) => (
                      <TableRow key={exc._id}>
                        <TableCell>{exc.excursion}</TableCell>
                        <TableCell>{exc.provincia}</TableCell>
                        <TableCell>{exc.localidad}</TableCell>
                        <TableCell>
                          <Chip
                            label={exc.habilitadaPorTemporada ? 'Activa' : 'Inactiva'}
                            color={exc.habilitadaPorTemporada ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleGestionarSalidas(exc)}
                            title="Gestionar Salidas"
                          >
                            <EventIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleEliminarExcursion(exc._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* TAB USUARIOS */}
        {tabValue === 1 && (
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5">Gestión de Usuarios</Typography>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => setOpenUsuarioDialog(true)}
              >
                Nuevo Usuario
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios.map((usr) => (
                    <TableRow key={usr._id}>
                      <TableCell>{usr.nombre} {usr.apellido}</TableCell>
                      <TableCell>{usr.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={usr.rol?.nombre || 'usuario'}
                          color={usr.rol?.nombre === 'admin' ? 'error' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleEliminarUsuario(usr._id)}
                          disabled={usr._id === usuario.id}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* DIALOG NUEVA EXCURSIÓN */}
        <Dialog open={openExcursionDialog} onClose={() => setOpenExcursionDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Nueva Excursión</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
              💡 Los precios se configurarán en las salidas individuales
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre de la Excursión *"
                  fullWidth
                  value={excursionForm.excursion}
                  onChange={(e) => setExcursionForm({ ...excursionForm, excursion: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Provincia *"
                  fullWidth
                  value={excursionForm.provincia}
                  onChange={(e) => setExcursionForm({ ...excursionForm, provincia: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Localidad *"
                  fullWidth
                  value={excursionForm.localidad}
                  onChange={(e) => setExcursionForm({ ...excursionForm, localidad: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  value={excursionForm.descripcion}
                  onChange={(e) => setExcursionForm({ ...excursionForm, descripcion: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="URL de Imagen"
                  fullWidth
                  value={excursionForm.img}
                  onChange={(e) => setExcursionForm({ ...excursionForm, img: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenExcursionDialog(false)}>Cancelar</Button>
            <Button onClick={handleCrearExcursion} variant="contained">Crear</Button>
          </DialogActions>
        </Dialog>

        {/* DIALOG NUEVO USUARIO */}
        <Dialog open={openUsuarioDialog} onClose={() => setOpenUsuarioDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Nuevo Usuario / Administrador</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre *"
                  fullWidth
                  value={usuarioForm.nombre}
                  onChange={(e) => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Apellido *"
                  fullWidth
                  value={usuarioForm.apellido}
                  onChange={(e) => setUsuarioForm({ ...usuarioForm, apellido: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email *"
                  type="email"
                  fullWidth
                  value={usuarioForm.email}
                  onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contraseña *"
                  type="password"
                  fullWidth
                  value={usuarioForm.contraseña}
                  onChange={(e) => setUsuarioForm({ ...usuarioForm, contraseña: e.target.value })}
                  helperText="Mínimo 6 caracteres"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Rol"
                  select
                  fullWidth
                  value={usuarioForm.rol}
                  onChange={(e) => setUsuarioForm({ ...usuarioForm, rol: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUsuarioDialog(false)}>Cancelar</Button>
            <Button onClick={handleCrearUsuario} variant="contained">Crear</Button>
          </DialogActions>
        </Dialog>

        {/* DIALOG GESTIÓN DE SALIDAS */}
        <GestionSalidas
          excursion={excursionSeleccionada}
          open={openSalidasDialog}
          onClose={() => {
            setOpenSalidasDialog(false);
            setExcursionSeleccionada(null);
          }}
          onUpdate={cargarExcursiones}
        />
      </Container>
    </>
  );
};

export default PanelAdmin;