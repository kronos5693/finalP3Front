import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar/navBar';
import SearchBar from '../components/Barrabusqueda/BarraBusqueda';
import CardSearch from '../components/Card/CardSearch';

function Excursionbusqueda() {
  // Accede al valor de 'provincia' desde la URL
  const { provincia } = useParams();

  return (
    <>
      <NavBar />
      <SearchBar />
  
      {/* Pasa 'provincia' como una propiedad al componente CardSearch */}
      <CardSearch provincia={provincia} />
    </>
  );
}

export default Excursionbusqueda;
