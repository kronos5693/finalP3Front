import React from 'react'
import "./barrabusqueda.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
function BarraBusqueda() {
  return (
    <div className="searchList">
        <div className="searchListItem">
        <FontAwesomeIcon icon={faMap} style={{ marginRight: '8px' }} />
        <span>Excurciones</span>
        </div>




    </div>
  )
}

export default BarraBusqueda