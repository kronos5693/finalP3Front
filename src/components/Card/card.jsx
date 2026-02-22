import React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
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

  let randomItems = getRandomItems(post, 6);

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
        LOS MÁS VISITADOS
      </Typography>
      <Grid 
        container 
        spacing={{ xs: 2, sm: 2.5, md: 3 }}
        sx={{
          justifyContent: "center"
        }}
      >
        {randomItems.map((point, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            {point && point.img && point.excursion && point.descripcion && (
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
            )}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Tarjeta;