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
    <Container 
      maxWidth={false}
      sx={{ 
        maxWidth: "1400px",
        margin: "0 auto",
        paddingX: { xs: 2, sm: 3, md: 4 },
        paddingY: 4 
      }}
    >
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ 
          marginBottom: 4, 
          fontWeight: 700,
          color: "#1976d2"
        }}
      >
        EXCURSIONES DE {provincia.toUpperCase()}
      </Typography>
      <Grid 
        container 
        spacing={{ xs: 2, sm: 2.5, md: 3 }}
        sx={{
          justifyContent: "center"
        }}
      >
        {excursiones.map((point, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={point._id || index}
            sx={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Card 
              elevation={2}
              sx={{ 
                width: "100%",
                maxWidth: "400px",
                height: "100%",
                display: "flex", 
                flexDirection: "column",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.15)"
                }
              }}
            >
              <CardActionArea 
                component={Link} 
                to={`/reserva/${point.excursion}`}
                sx={{ 
                  flexGrow: 1, 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "stretch"
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "220px",
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: "#f5f5f5"
                  }}
                >
                  <CardMedia
                    component="img"
                    image={point.img}
                    alt={point.excursion}
                    sx={{ 
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center"
                    }}
                  />
                </Box>
                <CardContent 
                  sx={{ 
                    flexGrow: 1, 
                    padding: 2,
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h3"
                    sx={{
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      marginBottom: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      minHeight: "2.6em",
                      lineHeight: 1.3
                    }}
                  >
                    {point.excursion}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      fontSize: "0.9rem",
                      lineHeight: 1.5
                    }}
                  >
                    {point.descripcion}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box sx={{ padding: 2, paddingTop: 0 }}>
                <Link to={`/reserva/${point.excursion}`} style={{ textDecoration: "none" }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    size="large"
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "1rem",
                      padding: "10px 24px",
                      borderRadius: "8px"
                    }}
                  >
                    Reservar
                  </Button>
                </Link>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default CardSearch;