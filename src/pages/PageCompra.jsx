import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar/navBar';
import { useParams } from 'react-router-dom';
import { Container, CardContent, Typography, CardMedia, Card, Grid, Paper, TextField, Button } from '@mui/material';
import axios from "axios";

const PageCompra = () => {
  const { excu } = useParams();
  const apiUrl = `http://localhost:3000/excursiones/${excu}`;
  const [post, setPost] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState(1);

  useEffect(() => {
    axios.get(apiUrl)
      .then((response) => {
        setPost(response.data);
        console.log(response.data);

  
        const nuevoPrecio = parseFloat(response.data.precio);
        setCompra({
          ...compra,
          precio: nuevoPrecio,
          total: nuevoPrecio * disponibilidad,
        });
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  }, [apiUrl]);

  const [compra, setCompra] = useState({
    fecha: '',
    personas: 1,
    precio: 0,
    total: 0,
  });

  const handleDisponibilidadChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue) && newValue >= 1) {
      setDisponibilidad(newValue);
      // Actualiza el estado de la compra cuando cambia la disponibilidad
      setCompra({
        ...compra,
        personas: newValue,
        total: parseFloat(post.precio) * newValue,
      });
    }
  };

  const today = new Date().toISOString().split('T')[0]; // Obtención de la fecha actual

  const handleCompra = () => {
    console.log('Detalles de la compra:', compra);
  };

  if (!post.excursion) {
    return <p>La excursión no se encuentra en la base de datos.</p>;
  }

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
                  image={post.img}
                  title="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {post.excursion}
                  </Typography>
                  <Typography variant="body2" color="text secondary">
                    {post.descripcion}
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
                    value={compra.fecha} // Asigna el valor del estado de compra a la fecha
                    onChange={(event) => setCompra({ ...compra, fecha: event.target.value })} // Actualiza la fecha en el estado de compra
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                  <Typography variant="h6" gutterBottom>
                    Numero de Personas
                  </Typography>
                  <TextField
                    id="disponibilidad"
                    label="Número de Personas"
                    type="number"
                    value={disponibilidad}
                    onChange={handleDisponibilidadChange}
                    fullWidth
                  />
                  <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                    Total a Pagar: ${compra.total}
                  </Typography>
                </div>
                <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleCompra}>
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
