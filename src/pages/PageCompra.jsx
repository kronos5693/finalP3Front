import React from 'react';
import NavBar from '../components/NavBar/navBar';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import Data from '../components/data/DataLugares.json';

const PageCompra = () => {
  const { excu } = useParams();


  const filtro = (excu, Data) => {
    return Data.filter(excursion => excursion.excursion === excu);
  };


  const resultado = filtro(excu, Data);

  return (
    <>
      <NavBar />
      <Container maxWidth="lg">
   <img src={resultado[0].img}></img>
      </Container>
    </>
  );
};

export default PageCompra;
