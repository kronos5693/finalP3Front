import React from 'react'
import SearchBar from '../components/Barrabusqueda/BarraBusqueda'
import Tarjeta from '../components/Card/card'
function Home() {
  return (
    <>
<div className="searchBar" style={{ marginBottom: '30px' }}>
<SearchBar/>
</div>
<div className='tarjeta' style={{ marginBottom: '20px' }}>
  <Tarjeta></Tarjeta>
</div>
  
  

    </>
  )
}

export default Home