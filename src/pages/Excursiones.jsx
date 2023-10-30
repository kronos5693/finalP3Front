import React from "react";
import Tarjeta from "../components/Card/card";
import SearchBar from "../components/Barrabusqueda/BarraBusqueda";
import NavBar from "../components/NavBar/navBar";

function Excursiones() {
  const bandera = false;
  return (
    <>
       <NavBar  />
    <div className="searchBar" style={{ marginBottom: '30px' }}>
<SearchBar/>
</div>
      <div style={{ marginTop: "50px" }}>
        <Tarjeta bandera={bandera}></Tarjeta>
      </div>
    </>
  );
}

export default Excursiones;
