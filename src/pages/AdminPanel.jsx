import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HikingIcon from '@mui/icons-material/Hiking';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import NavBar from '../components/NavBar/navBar';

const AdminPanel = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Gestionar Excursiones',
      description: 'Crear, editar y eliminar excursiones',
      icon: <HikingIcon sx={{ fontSize: 60 }} />,
      path: '/admin/excursiones',
      color: '#1976d2'
    },
    {
      title: 'Gestionar Salidas',
      description: 'Crear y administrar salidas específicas',
      icon: <EventIcon sx={{ fontSize: 60 }} />,
      path: '/admin/salidas',
      color: '#2e7d32'
    },
    {
      title: 'Ver Reservas',
      description: 'Ver todas las reservas del sistema',
      icon: <ConfirmationNumberIcon sx={{ fontSize: 60 }} />,
      path: '/admin/reservas',
      color: '#ed6c02'
    }
  ];

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
          Panel de Administración
        </Typography>

        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6
                  }
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: item.color, mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2, bgcolor: item.color }}
                    fullWidth
                  >
                    Acceder
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default AdminPanel;