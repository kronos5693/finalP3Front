import React, { useState } from "react";
import "./barrabusqueda.css";
import { Box, TextField, MenuItem } from "@mui/material";
import Data from "../data/DataLugares.json";
import { Link } from "react-router-dom";

function SearchBar() {
  const [provincia, setProvincia] = useState("");

  const handleChange = (event) => {
    setProvincia(event.target.value);
  };

  const provinciasUnicas = Data.map((element) => element.provincia)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Define una clase CSS para restaurar los estilos predeterminados de Material-UI
  const linkStyles = {
    textDecoration: "none", // Quita la subrayado
    color: "inherit", // Utiliza el color por defecto
  };

  return (
    <Box
      style={{ marginTop: "30px" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <TextField
        label="Busca tu Provincia Favorita"
        select
        value={provincia}
        onChange={handleChange}
        style={{ width: "25%" }}
      >
        {provinciasUnicas.map((item) => (
          <MenuItem key={item} value={item}>
            <Link to={`/excursionbusqueda/${item}`} style={linkStyles}>
              {item.toUpperCase()}
            </Link>
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}

export default SearchBar;
