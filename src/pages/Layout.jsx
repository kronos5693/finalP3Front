import React from "react";
import { Link, Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <div>
    
      <nav>
        <ul>
          <li>
            <Link to="/">Inicioo</Link>
          </li>
          <li>
            <Link to="/Excursiones">Excursiones</Link>
          </li>
          <li>
            <Link to="/Experiencias">Experiencias</Link>
          </li>
          <li>
            <Link to="/Contacto">Contacto</Link>
          </li>
        </ul>
      </nav>
      <hr />

      <Outlet />
    </div>
  );
};

export default Layout;
