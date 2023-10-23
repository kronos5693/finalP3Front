import React from "react";
import "./barrabusqueda.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faPerson, faMap } from "@fortawesome/free-solid-svg-icons";

function searchBar() {
  return (
    <>
    <div className="searchList">
      <div className="searchListItem">
        <FontAwesomeIcon icon={faMap} style={{ marginRight: "8px" }} />
        <input type="text" placeholder="Busca tu excursión" className="searchInput" />
      </div>
      <div className="searchListItem">
        <FontAwesomeIcon icon={faCalendarDay} style={{ marginRight: "8px" }} />
        <span className="searchText">Elije tus días</span>
      </div>
      <div className="searchListItem">
        <FontAwesomeIcon icon={faPerson} style={{ marginRight: "8px" }} />
        <span className="searchText">2 Adultos</span>
      </div>
      <div className="searchListItem">
        <button className="btnSearch">Buscar</button>
      </div>


    </div>
    </>
    
  );
}

export default searchBar;
