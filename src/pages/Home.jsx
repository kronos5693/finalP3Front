import React from 'react'
import SearchBar from '../components/Barrabusqueda/BarraBusqueda'
import Tarjeta from '../components/Card/card'
import TarjetaPeople from '../components/Card/cardPeople'


function Home() {
  const bandera=true;
  return (
    <>
<div className="searchBar" style={{ marginBottom: '30px' }}>
<SearchBar/>
</div>
<div className='tarjeta' style={{ marginBottom: '20px' }}>
  <Tarjeta></Tarjeta>
</div>
  <div>
    <TarjetaPeople bandera={bandera}></TarjetaPeople>
  </div>
    </>
  )
}

export default Home