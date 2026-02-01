import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faHome, faBomb, faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCarrito } from '../../context/CarritoContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './navBar.css';

const navArrayLinks = [
  {
    title: "Inicio",
    path: "/",
    icon: faHome,
  },
  {
    title: "Excursiones",
    path: "/excursiones",
    icon: faMap,
  },
  {
    title: "Experiencias",
    path: "/experiencias",
    icon: faBomb,
  },
  {
    title: "Contacto",
    path: "/contacto",
    icon: faIdBadge,
  },
];

export default function NavBar() {
  const { usuario, logout, isAuthenticated } = useAuth();
  const { cantidadItems } = useCarrito();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isAdmin = usuario?.rol === 'admin';

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handlePerfil = () => {
    handleClose();
    navigate('/perfil');
  };

  const handleCarrito = () => {
    navigate('/carrito');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ 
          display: 'flex', 
          alignItems: 'center',
          minHeight: '64px'
        }}>
          {/* Links de navegación */}
          {navArrayLinks.map((item, index) => (
            <Button
              key={index}
              color="inherit"
              component={Link}
              to={item.path}
              className="btnNav"
            >
              <FontAwesomeIcon
                icon={item.icon}
                style={{ color: "#ffffff", marginRight: '8px' }}
              />
              <Typography variant="button" style={{ fontSize: '18px' }}>
                {item.title}
              </Typography>
            </Button>
          ))}

          {/* Espaciador flexible */}
          <Box sx={{ flex: 1 }} /> 

          {/* Sección derecha - ORDEN: Nombre, Perfil, Carrito */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            {isAuthenticated ? (
              <>
                {/* 1. NOMBRE - Saludo al usuario */}
                <Typography 
                  variant="body1" 
                  sx={{ 
                    display: { xs: 'none', sm: 'block' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  Hola, {usuario?.nombre}!
                </Typography>

                {/* 2. PERFIL - Icono de perfil */}
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <AccountCircleIcon />
                </IconButton>

                {/* 3. CARRITO - Solo visible para usuarios normales */}
                {!isAdmin && (
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleCarrito}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Badge 
                      badgeContent={cantidadItems} 
                      color="error"
                      max={99}
                    >
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                )}

                {/* Menú desplegable */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">
                      {usuario?.email}
                    </Typography>
                  </MenuItem>

                  <MenuItem onClick={handlePerfil}>
                    Mi Perfil
                  </MenuItem>

                  {/* PANEL ADMIN - Solo para administradores */}
                  {isAdmin && (
                    <MenuItem component={Link} to="/admin" onClick={handleClose}>
                      Panel Admin
                    </MenuItem>
                  )}

                  {/* MIS RESERVAS - Solo para usuarios normales */}
                  {!isAdmin && (
                    <MenuItem component={Link} to="/mis-reservas" onClick={handleClose}>
                      Mis Reservas
                    </MenuItem>
                  )}

                  <MenuItem onClick={handleLogout}>
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/registro">
                  SignUp
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}