import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CircularProgress, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import api from '../../services/api';

function getRandomItems(array, count) {
  const shuffled = array.slice();
  let i = array.length;
  const min = i - count;
  let temp;
  let index;

  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }

  return shuffled.slice(min);
}

function TarjetaPeople({ bandera }) {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonajes = async () => {
      try {
        const response = await api.get('/personajes');
        console.log('Personajes:', response.data);
        setPost(response.data);
      } catch (error) {
        console.error('Error al obtener personajes:', error);
        setError('Error al cargar las opiniones');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonajes();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" align="center" color="error">
              {error}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  let randomItems = [];
  if (bandera) {
    randomItems = getRandomItems(post, 3);
  } else {
    randomItems = getRandomItems(post, 6);
  }

  return (
    <Container maxWidth="lg">
      <Card>
        <CardContent>
          <Typography variant="h4" align="center">
            OPINIONES
          </Typography>
          <Grid container spacing={5} style={{ marginTop: "25px" }}>
            {randomItems.map((point, index) => (
              <Grid item xs={12} sm={4} key={point._id || index}>
                {point && point.img && point.nombre && point.descripcion && (
                  <Card sx={{ maxWidth: 345 }} style={{ padding: "10px", marginTop: "30px" }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={point.img}
                        alt={point.nombre}
                        style={{ borderRadius: "5px" }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {point.nombre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="justify">
                          {point.descripcion}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                )}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default TarjetaPeople;
