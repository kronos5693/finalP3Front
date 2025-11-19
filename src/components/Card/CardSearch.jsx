import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea, CircularProgress, Box } from "@mui/material";
import { Link } from "react-router-dom";
import api from '../../services/api';

function CardSearch({ provincia }) {
  const [excursiones, setExcursiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExcursiones = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/excursiones/provincia/${provincia}`);
        console.log('Excursiones de provincia:', response.data);
        setExcursiones(response.data);
      } catch (error) {
        console.error('Error al obtener excursiones:', error);
        setError('Error al cargar las excursiones de esta provincia');
      } finally {
        setLoading(false);
      }
    };

    if (provincia) {
      fetchExcursiones();
    }
  }, [provincia]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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

  if (excursiones.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" align="center">
              No se encontraron excursiones en {provincia}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Card>
        <CardContent>
          <Typography variant="h4" align="center">
            EXCURSIONES DE {provincia.toUpperCase()}
          </Typography>
          <Grid container spacing={5} style={{ marginTop: "25px" }}>
            {excursiones.map((point, index) => (
              <Grid item xs={12} sm={4} key={point._id || index}>
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
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default CardSearch;
