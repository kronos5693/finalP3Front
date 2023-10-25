import React from "react";
import TarjetaPeople from "../components/Card/cardPeople";

function Experiencias() {
  const bandera = false;
  return (
    <>
      <div style={{ marginTop: "50px" }}>
        <TarjetaPeople bandera={bandera}></TarjetaPeople>
      </div>
    </>
  );
}

export default Experiencias;
