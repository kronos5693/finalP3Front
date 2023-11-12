import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Data from "../data/DataLugares.json";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

function CardSearch({ provincia }) {
 // const excursiones = Data.filter((excursion) => excursion.provincia === provincia);
  const prov = provincia.toString(); 
  const apiUrl = `http://localhost:3000/excursiones/provincia/${prov}`;

  const [excursiones, setExcursiones] = useState([]);

  useEffect(() => {
    axios.get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setExcursiones(response.data);
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  }, [apiUrl]);

  return (
    <Container maxWidth="lg">
      <Card>
        <CardContent>
          <Typography variant="h4" align="center">
            EXCURSIONES DE {provincia.toUpperCase()}
          </Typography>
          <Grid container spacing={5} style={{ marginTop: "25px" }}>
            {excursiones.map((point, index) => (
              <Grid item xs={12} sm={4} key={index}>
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
                        Precio: {point.precio}
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
