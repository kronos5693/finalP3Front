import React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
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

function Tarjeta({ bandera }) {
  const [post, setPost] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchExcursiones = async () => {
      try {
        const response = await api.get('/excursiones');
        console.log('Excursiones:', response.data);
        setPost(response.data);
      } catch (error) {
        console.error('Error al obtener excursiones:', error);
        setError('Error al cargar las excursiones');
      } finally {
        setLoading(false);
      }
    };

    fetchExcursiones();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Card>
          <CardContent>
            <Typography variant="h5" align="center">
              Cargando excursiones...
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
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
            LOS MÁS VISITADOS
          </Typography>
          <Grid container spacing={5} style={{ marginTop: "25px" }}>
            {randomItems.map((point, index) => (
              <Grid item xs={12} sm={4} key={index}>
                {point && point.img && point.excursion && point.descripcion && point.precio && (
                  <Card sx={{ maxWidth: 345 }} style={{ padding: "10px", marginTop: "30px", display: "flex", flexDirection: "column" }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={point.img}
                        alt={point.excursion}
                        style={{ borderRadius: "5px" }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {point.excursion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="justify">
                          {point.descripcion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Precio: ${point.precio}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <div style={{ display: "flex" }}>
                      <Link to={`/compra/${point.excursion}`} style={{ width: "100%" }}>
                        <Button variant="contained" size="small" style={{ width: "100%" }}>
                          COMPRAR
                        </Button>
                      </Link>
                    </div>
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

export default Tarjeta;
