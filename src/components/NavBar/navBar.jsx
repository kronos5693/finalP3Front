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
import "./navBar.css";
import { Link, NavLink } from 'react-router-dom';

export default function NavBar({navArrayLinks}) {


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {navArrayLinks.map((item, index) => (
            <Typography  variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Button  key={index} color="inherit" component={NavLink} to={item.path} className="btnNav">
                <FontAwesomeIcon icon={item.icon} style={{ color: "#ffffff", marginRight: '8px' }} />
                <Typography variant="button" style={{ fontSize: '18px' }}>{item.title}</Typography>
              </Button>
            </Typography>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="inherit">Login</Button>
            <Button color="inherit">SignUp</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
