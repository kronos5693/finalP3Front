import React, { useState } from 'react';
import NavBar from '../components/NavBar/navBar';
import { useParams } from 'react-router-dom';
import { Container, CardContent, Typography, CardMedia, Card, Grid, Paper, TextField, Button } from '@mui/material';
import Data from '../components/data/DataLugares.json';

const PageCompra = () => {
  const { excu } = useParams();
  const filtro = (excu, data) => {
    return data.filter(excursion => excursion.excursion === excu);
  };

  const resultado = filtro(excu, Data);
  const [disponibilidad, setDisponibilidad] = useState(1); // Inicializado en 1

  const handleDisponibilidadChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue) && newValue >= 1) {
      setDisponibilidad(newValue);
    }
  };

  const today = new Date().toISOString().split('T')[0]; // Obtén la fecha actual en formato 'YYYY-MM-DD'

  return (
    <>
      <NavBar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ maxWidth: 600, height: '100%' }}>
                <CardMedia
                  sx={{ width: '100%', paddingTop: '56.25%' }}
                  image={resultado[0].img}
                  title="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {resultado[0].excursion}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {resultado[0].descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Selección de Fecha
                  </Typography>
                  <TextField
                    id="fecha"
                    label="Fecha de Excursión"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    inputProps={{ min: today }} // Establece el mínimo a la fecha actual
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                  <Typography variant="h6" gutterBottom>
                    Disponibilidad
                  </Typography>
                  <TextField
                    id="disponibilidad"
                    label="Número de Personas"
                    type="number"
                    value={disponibilidad}
                    onChange={handleDisponibilidadChange}
                    fullWidth
                  />
                </div>
                <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
                  Comprar Excursión
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default PageCompra;
