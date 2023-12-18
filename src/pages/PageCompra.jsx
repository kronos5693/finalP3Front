import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar/navBar';
import { useParams } from 'react-router-dom';
import {
  Container,
  CardContent,
  Typography,
  CardMedia,
  Card,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

const PageCompra = () => {
  const { excu } = useParams();
  const apiUrl = `http://localhost:3000/excursiones/${excu}`;
  const [post, setPost] = useState({});
  const [disponibilidad, setDisponibilidad] = useState(1);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [compra, setCompra] = useState({
    fecha: today, // Inicializar con la fecha actual
    personas: 1,
    precio: 0,
    total: 0,
    horario: '',
  });

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const data = response.data;
        console.log('Datos de la base de datos:', data);
        setPost(data);

        const nuevoPrecio = parseFloat(data.precio);
        setCompra((prevCompra) => ({
          ...prevCompra,
          precio: nuevoPrecio,
          total: nuevoPrecio * disponibilidad,
        }));

        // Establecer el primer horario como valor inicial
        if (data.horarios && data.horarios.length > 0) {
          setHorarioSeleccionado(data.horarios[0].turno);
          setCompra((prevCompra) => ({
            ...prevCompra,
            horario: data.horarios[0].turno,
          }));
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  }, [apiUrl]);

  const handleDisponibilidadChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue) && newValue >= 1) {
      setDisponibilidad(newValue);
      setCompra((prevCompra) => ({
        ...prevCompra,
        personas: newValue,
        total: parseFloat(post.precio) * newValue,
      }));
    }
  };

  const handleHorarioChange = (event) => {
    const newHorario = event.target.value;
    setHorarioSeleccionado(newHorario);
    setCompra((prevCompra) => ({
      ...prevCompra,
      horario: newHorario,
    }));
  };

  const handleCompra = () => {
    // Asignar la fecha seleccionada al objeto de compra
    setCompra((prevCompra) => ({
      ...prevCompra,
      fecha: compra.fecha,
    }));

    console.log('Detalles de la compra:', compra);

    // Construir el objeto de compra a enviar al servidor
    const compraData = {
      idUsuario: '655233d77f776cc0856ea2ed',
      idExcursion: post._id,
      cantidadPersonas: compra.personas,
      fechaCompra: new Date(),
      fechaExcursion: compra.fecha,
      turnoExcursion: compra.horario,
      totalPagado: compra.total,
    };

    // Realizar la llamada a la API para realizar la compra
    const apiUrlCompra = 'http://localhost:3000/compra/';
    axios
      .post(apiUrlCompra, compraData)
      .then((response) => {
        console.log('Compra realizada con éxito:', response.data);

        // Después de la compra, actualizar la disponibilidad en la base de datos
        const nuevaDisponibilidad =
          post.horarios.find((horario) => horario.turno === compra.horario).disponibilidad -
          compra.personas;

        const apiUrlUpdateDisponibilidad = `http://localhost:3000/excursiones/${post._id}`;
        axios
          .patch(apiUrlUpdateDisponibilidad, { disponibilidad: nuevaDisponibilidad })
          .then(() => {
            console.log('Disponibilidad actualizada con éxito.');
          })
          .catch((error) => {
            console.error('Error al actualizar la disponibilidad:', error);
          });
      })
      .catch((error) => {
        console.error('Error al realizar la compra:', error);
        // Imprimir información detallada sobre el error
        if (error.response) {
          console.error('Respuesta del servidor:', error.response.data);
          console.error('Código de estado:', error.response.status);
        } else if (error.request) {
          console.error('No se recibió respuesta del servidor');
        } else {
          console.error(
            'Error durante la configuración de la solicitud o procesamiento de la respuesta:',
            error.message
          );
        }
      });
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
                    inputProps={{ min: today }}
                    value={compra.fecha}
                    onChange={(event) => setCompra({ ...compra, fecha: event.target.value })}
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
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                  <Typography variant="h6" gutterBottom>
                    Horario de Excursión
                  </Typography>
                  <TextField
                    id="horario"
                    label="Horario de Excursión"
                    value={horarioSeleccionado}
                    onChange={handleHorarioChange}
                    fullWidth
                    select
                  >
                    {post.horarios &&
                      post.horarios.map((horario) => (
                        <MenuItem key={horario.turno} value={horario.turno}>
                          {horario.turno} ({horario.disponibilidad} disponibles)
                        </MenuItem>
                      ))}
                  </TextField>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                  <Typography variant="h6" gutterBottom>
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

