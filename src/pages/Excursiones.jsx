import React from "react";
import Tarjeta from "../components/Card/card";
import SearchBar from "../components/Barrabusqueda/BarraBusqueda";

function Excursiones() {
  const bandera = false;
  return (
    <>
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
