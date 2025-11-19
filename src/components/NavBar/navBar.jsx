import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  const handleProfile = () => {
    handleClose();
    // Puedes crear una página de perfil más adelante
    alert('Funcionalidad de perfil próximamente');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className="toolbar">
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

          <Box sx={{ flex: 1 }} /> 

          <div className="login-signup-buttons">
            {isAuthenticated ? (
              <>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    marginRight: 2,
                    display: { xs: 'none', sm: 'block' } 
                  }}
                >
                  Hola, {usuario?.nombre}!
                </Typography>
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
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
                  <MenuItem onClick={handleProfile}>Mi Perfil</MenuItem>
                  {usuario?.rol === 'admin' && (
                    <MenuItem component={Link} to="/admin" onClick={handleClose}>
                      Panel Admin
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
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
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
