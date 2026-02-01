import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import { 
  Drawer, Box, Typography, IconButton, Button, Divider, 
  List, Alert, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

const Carrito = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { carrito, loading, eliminarItem, vaciarCarrito, procesarCheckout, actualizarItem } = useCarrito();
  const [openCheckout, setOpenCheckout] = useState(false);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [observaciones, setObservaciones] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleEliminar = async (idSalida) => {
    try {
      await eliminarItem(idSalida);
      setMensaje({ tipo: 'success', texto: 'Item eliminado del carrito' });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar item' });
    }
  };

  const handleVaciar = async () => {
    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
      try {
        await vaciarCarrito();
        setMensaje({ tipo: 'success', texto: 'Carrito vaciado' });
      } catch (error) {
        setMensaje({ tipo: 'error', texto: 'Error al vaciar carrito' });
      }
    }
  };

  const handleCheckout = async () => {
    try {
      setProcesando(true);
      const resultado = await procesarCheckout(metodoPago, observaciones);
      
      setMensaje({ 
        tipo: 'success', 
        texto: `¡Checkout exitoso! ${resultado.reservasCreadas} reserva(s) confirmada(s)` 
      });
      
      setOpenCheckout(false);
      onClose();
      
      setTimeout(() => {
        navigate('/mis-reservas');
      }, 2000);
    } catch (error) {
      setMensaje({ 
        tipo: 'error', 
        texto: error.response?.data?.mensaje || 'Error al procesar checkout' 
      });
    } finally {
      setProcesando(false);
    }
  };

  const handleCantidadChange = async (idSalida, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    try {
      await actualizarItem(idSalida, nuevaCantidad);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al actualizar cantidad' });
    }
  };

  if (!carrito) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      </Drawer>
    );
  }

  const items = carrito.items || [];

  //  CALCULAR TOTAL LOCALMENTE (igual que en cada item)
  const calcularSubtotal = (item) => {
    const precio = item.salida?.precioPersona || item.precioUnitario || 0;
    return item.cantidadPersonas * precio;
  };

  const totalCarrito = items.reduce((sum, item) => sum + calcularSubtotal(item), 0);

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingCartIcon color="primary" />
              <Typography variant="h6">Mi Carrito</Typography>
            </Box>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {mensaje.texto && (
            <Box sx={{ p: 2 }}>
              <Alert severity={mensaje.tipo} onClose={() => setMensaje({ tipo: '', texto: '' })}>
                {mensaje.texto}
              </Alert>
            </Box>
          )}

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ShoppingCartIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Tu carrito está vacío
                </Typography>
                <Button variant="contained" onClick={() => { onClose(); navigate('/excursiones'); }} sx={{ mt: 2 }}>
                  Ver Excursiones
                </Button>
              </Box>
            ) : (
              <List>
                {items.map((item) => {
                  const subtotal = calcularSubtotal(item);
                  
                  return (
                    <Box key={item._id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <img 
                          src={item.salida?.excursion?.img} 
                          alt={item.salida?.excursion?.excursion}
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.salida?.excursion?.excursion}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(item.salida?.fecha).toLocaleDateString('es-AR')} - {item.salida?.horario}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Button 
                              size="small" 
                              onClick={() => handleCantidadChange(item.salida._id, item.cantidadPersonas - 1)}
                              disabled={item.cantidadPersonas <= 1}
                            >
                              -
                            </Button>
                            <Typography>{item.cantidadPersonas}</Typography>
                            <Button 
                              size="small" 
                              onClick={() => handleCantidadChange(item.salida._id, item.cantidadPersonas + 1)}
                            >
                              +
                            </Button>
                            <Typography sx={{ ml: 'auto' }} fontWeight="bold">
                              ${subtotal}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleEliminar(item.salida._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </List>
            )}
          </Box>

          {items.length > 0 && (
            <>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">${totalCarrito}</Typography>
                </Box>
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  onClick={() => setOpenCheckout(true)}
                  disabled={loading}
                >
                  Proceder al Checkout
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  size="small"
                  onClick={handleVaciar}
                  sx={{ mt: 1 }}
                >
                  Vaciar Carrito
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      <Dialog open={openCheckout} onClose={() => setOpenCheckout(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Finalizar Compra</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Método de Pago"
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="efectivo">Efectivo</MenuItem>
              <MenuItem value="tarjeta">Tarjeta</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Observaciones (opcional)"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej: Sin gluten, alergia a mariscos, etc."
            />
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Total de items: {items.length}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total a pagar: ${totalCarrito}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCheckout(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleCheckout}
            disabled={procesando}
          >
            {procesando ? <CircularProgress size={24} /> : 'Confirmar Compra'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Carrito;