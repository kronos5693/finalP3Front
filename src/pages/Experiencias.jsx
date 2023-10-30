import React from "react";
import TarjetaPeople from "../components/Card/cardPeople";
import NavBar from "../components/NavBar/navBar";

function Experiencias() {
  const bandera = false;
  return (
    <>
       <NavBar  />
      <div style={{ marginTop: "50px" }}>
        <TarjetaPeople bandera={bandera}></TarjetaPeople>
      </div>
    </>
  );
}

export default Experiencias;
