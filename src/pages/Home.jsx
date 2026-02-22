import React from 'react';
import SearchBar from '../components/Barrabusqueda/BarraBusqueda';
import Tarjeta from '../components/Card/card';
import NavBar from '../components/NavBar/navBar';
import { Container, Typography, Box } from '@mui/material';

function Home() {
  const bandera = false;
  return (
    <>
      <NavBar />
      
      <Container maxWidth="xl" sx={{ my: 4 }}>
        <Box sx={{ textAlign: 'center', px: { xs: 2, sm: 4 } }}>
          {/* Recuadro con borde gris, fondo claro, sombra y  padding */}
          <Box
            sx={{
              borderLeft: 6,
              borderColor: 'grey.400',
              bgcolor: 'grey.100',
              pl: 4,
              pr: 4,
              py: 3,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                lineHeight: 1.6,
                
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              
                fontSize: { xs: '1.3rem', sm: '1.7rem', md: '2rem' },
              }}
            >
              Somos tu brújula hacia lo auténtico. Salí de lo convencional y animate a explorar la Argentina de una manera única. 
              Te acompañaremos a recorrer rincones emblemáticos y a revelar esos secretos que pocos conocen. ¡Animate, te esperamos!
            </Typography>
          </Box>
        </Box>
      </Container>
      <div className="searchBar" style={{ marginBottom: '30px' }}>
        <SearchBar />
      </div>
      <div className="tarjeta" style={{ marginBottom: '20px' }}>
        <Tarjeta  />
      </div>
      {/* <div><TarjetaPeople bandera={bandera} /></div> */}
    </>
  );
}

export default Home;