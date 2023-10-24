import React, { useState } from "react";
import "./barrabusqueda.css";
import { Box, TextField, MenuItem } from "@mui/material";

function SearchBar() {
  const [provincia, setProvincia] = useState("");

  const handleChange = (event) => {
    setProvincia(event.target.value);
  };

  const provincias = [
    { title: "provincia1", value: "prov1" },
    { title: "provincia2", value: "prov2" },
    { title: "provincia3", value: "prov3" },
    { title: "provincia4", value: "prov4" },
    { title: "provincia5", value: "prov5" },
  ];

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
        {provincias.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.title}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}

export default SearchBar;
