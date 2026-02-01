import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Grid, Avatar, Chip, Button,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, CircularProgress, Divider
} from '@mui/material';
import NavBar from '../components/NavBar/navBar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import CakeIcon from '@mui/icons-material/Cake';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';

const Perfil = () => {
  const { usuario } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  
  const [editForm, setEditForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    edad: '',
    telefono: '',
    direccion: {
      calle: '',
      ciudad: '',
      provincia: '',
      codigoPostal: '',
      pais: 'Argentina'
    }
  });
  
  const [passwordForm, setPasswordForm] = useState({
    contraseñaActual: '',
    contraseñaNueva: '',
    confirmarContraseña: ''
  });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/usuarios/perfil');
      setPerfil(response.data);
      
      setEditForm({
        nombre: response.data.nombre || '',
        apellido: response.data.apellido || '',
        email: response.data.email || '',
        edad: response.data.edad !== undefined ? response.data.edad.toString() : '',
        telefono: response.data.telefono || '',
        direccion: {
          calle: response.data.direccion?.calle || '',
          ciudad: response.data.direccion?.ciudad || '',
          provincia: response.data.direccion?.provincia || '',
          codigoPostal: response.data.direccion?.codigoPostal || '',
          pais: response.data.direccion?.pais || 'Argentina'
        }
      });
      
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setError(error.response?.data?.mensaje || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('direccion.')) {
      const field = name.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [field]: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGuardarCambios = async () => {
    try {
      setError('');
      setSuccess('');
      
      if (!perfil || !perfil._id) {
        setError('ID de usuario inválido. Recarga la página.');
        return;
      }

      const payload = { ...editForm };

      if (payload.contraseña === '') delete payload.contraseña;
      if (payload.edad === '') delete payload.edad;
      else payload.edad = parseInt(payload.edad, 10);
      if (payload.telefono === '') delete payload.telefono;

      const direccionLimpia = {};
      for (const [key, value] of Object.entries(payload.direccion)) {
        if (value !== '') direccionLimpia[key] = value;
      }
      if (Object.keys(direccionLimpia).length > 0) {
        payload.direccion = direccionLimpia;
      } else {
        delete payload.direccion;
      }

      const response = await api.put(`/usuarios/${perfil._id}`, payload);
      
      setPerfil(prev => ({
        ...prev,
        ...response.data.usuario
      }));
      
      setSuccess('Perfil actualizado con éxito');
      setTimeout(() => {
        setOpenEditDialog(false);
        setSuccess('');
      }, 2000);
      
    } catch (error) {
      console.error('Error al guardar:', error);
      setError(error.response?.data?.mensaje || 'Error al actualizar el perfil');
    }
  };

  const handleCambiarContraseña = async () => {
    try {
      setError('');
      setSuccess('');

      if (passwordForm.contraseñaNueva !== passwordForm.confirmarContraseña) {
        setError('Las contraseñas no coinciden');
        return;
      }

      if (passwordForm.contraseñaNueva.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      await api.put('/usuarios/cambiar-password', {
        contraseñaActual: passwordForm.contraseñaActual,
        contraseñaNueva: passwordForm.contraseñaNueva
      });

      setSuccess('Contraseña actualizada con éxito');
      setTimeout(() => {
        setOpenPasswordDialog(false);
        setSuccess('');
        setPasswordForm({
          contraseñaActual: '',
          contraseñaNueva: '',
          confirmarContraseña: ''
        });
      }, 2000);

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setError(error.response?.data?.mensaje || 'Error al cambiar la contraseña');
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  if (!perfil) {
    return (
      <>
        <NavBar />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">
            {error || 'Error al cargar el perfil'}
          </Alert>
          <Button onClick={cargarPerfil} sx={{ mt: 2 }}>Reintentar</Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        <Paper elevation={3} sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: perfil?.rol?.nombre === 'admin' ? 'error.main' : 'primary.main',
                mr: 3
              }}
            >
              {perfil?.rol?.nombre === 'admin' ? (
                <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />
              ) : (
                <PersonIcon sx={{ fontSize: 40 }} />
              )}
            </Avatar>
            <Box>
              <Typography variant="h4">
                {perfil?.nombre} {perfil?.apellido}
              </Typography>
              <Chip
                label={perfil?.rol?.nombre === 'admin' ? 'Administrador' : 'Usuario'}
                color={perfil?.rol?.nombre === 'admin' ? 'error' : 'primary'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={1}>
                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">Nombre</Typography>
              </Box>
              <Typography>{perfil?.nombre} {perfil?.apellido}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
              </Box>
              <Typography>{perfil?.email}</Typography>
            </Grid>

            {perfil?.edad && (
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <CakeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary">Edad</Typography>
                </Box>
                <Typography>{perfil.edad} años</Typography>
              </Grid>
            )}

            {perfil?.telefono && (
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary">Teléfono</Typography>
                </Box>
                <Typography>{perfil.telefono}</Typography>
              </Grid>
            )}

            {perfil?.direccion && (
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={1}>
                  <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary">Dirección</Typography>
                </Box>
                <Typography>
                  {perfil.direccion.calle && `${perfil.direccion.calle}, `}
                  {perfil.direccion.ciudad && `${perfil.direccion.ciudad}, `}
                  {perfil.direccion.provincia && `${perfil.direccion.provincia}, `}
                  {perfil.direccion.codigoPostal && `CP: ${perfil.direccion.codigoPostal}, `}
                  {perfil.direccion.pais || 'Argentina'}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Box mt={4} display="flex" gap={2}>
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setOpenEditDialog(true)}>
              Editar Perfil
            </Button>
            <Button variant="outlined" startIcon={<LockIcon />} onClick={() => setOpenPasswordDialog(true)}>
              Cambiar Contraseña
            </Button>
          </Box>
        </Paper>

        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField name="nombre" label="Nombre" fullWidth value={editForm.nombre} onChange={handleEditChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="apellido" label="Apellido" fullWidth value={editForm.apellido} onChange={handleEditChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField name="email" label="Email" type="email" fullWidth value={editForm.email} onChange={handleEditChange} required disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="edad" label="Edad" type="number" fullWidth value={editForm.edad} onChange={handleEditChange} inputProps={{ min: 0, max: 150 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="telefono" label="Teléfono" fullWidth value={editForm.telefono} onChange={handleEditChange} />
              </Grid>
              
              <Grid item xs={12}><Typography variant="h6" sx={{ mt: 2 }}>Dirección</Typography></Grid>
              
              <Grid item xs={12}>
                <TextField name="direccion.calle" label="Calle" fullWidth value={editForm.direccion.calle} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="direccion.ciudad" label="Ciudad" fullWidth value={editForm.direccion.ciudad} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="direccion.provincia" label="Provincia" fullWidth value={editForm.direccion.provincia} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="direccion.codigoPostal" label="CP" fullWidth value={editForm.direccion.codigoPostal} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="direccion.pais" label="País" fullWidth value={editForm.direccion.pais} onChange={handleEditChange} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
            <Button onClick={handleGuardarCambios} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            <TextField
              name="contraseñaActual" label="Contraseña Actual" type="password" fullWidth margin="normal"
              value={passwordForm.contraseñaActual}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, contraseñaActual: e.target.value }))}
              required
            />
            <TextField
              name="contraseñaNueva" label="Nueva Contraseña" type="password" fullWidth margin="normal"
              value={passwordForm.contraseñaNueva}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, contraseñaNueva: e.target.value }))}
              helperText="Mínimo 6 caracteres"
              required
            />
            <TextField
              name="confirmarContraseña" label="Confirmar" type="password" fullWidth margin="normal"
              value={passwordForm.confirmarContraseña}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmarContraseña: e.target.value }))}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordDialog(false)}>Cancelar</Button>
            <Button onClick={handleCambiarContraseña} variant="contained">Cambiar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Perfil;