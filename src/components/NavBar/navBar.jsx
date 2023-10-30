import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from 'react-router-dom';
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

          <Box sx={{ flex: 1 }} /> {/* Espacio flexible para empujar los botones a la derecha */}
          <div className="login-signup-buttons">
            <Button color="inherit">Login</Button>
            <Button color="inherit">SignUp</Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
