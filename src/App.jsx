import "./App.css";
import { createRoot } from "react-dom/client";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Excursiones from "./pages/Excursiones";
import Contacto from "./pages/Contacto";
import Experiencias from "./pages/Experiencias";
import NavBar from "./components/NavBar/navBar";

// Importación de iconos
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { faIdBadge } from "@fortawesome/free-solid-svg-icons";

function App() {
  const navArrayLinks = [
    {
      title: "Inicio",
      path: "/",
      icon: faHome,
      element: Home,
    },
    {
      title: "Excursiones",
      path: "/excursiones",
      icon: faMap,
      element: Excursiones,
    },
    {
      title: "Experiencias",
      path: "/experiencias",
      icon: faBomb,
      element: Experiencias,
    },
    {
      title: "Contacto",
      path: "/contacto",
      icon: faIdBadge,
      element: Contacto,
    },
  ];
  return (
    <>
      <div className="">
        <NavBar navArrayLinks={navArrayLinks} />
        <Routes>
          {navArrayLinks.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<item.element />}
            />
          ))}
          /*
          <Route path="/" element={<Home />}></Route>
          <Route path="/excursiones" element={<Excursiones />}></Route>
          <Route path="/contacto" element={<Contacto />}></Route>
          <Route path="/experiencias" element={<Experiencias />}></Route>
          */
        </Routes>
      </div>
    </>
  );
}

export default App;
