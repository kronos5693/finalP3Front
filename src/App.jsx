import "./App.css";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Excursiones from "./pages/Excursiones";
import Contacto from "./pages/Contacto";
import Experiencias from "./pages/Experiencias";
import NavBar from "./components/NavBar/navBar";

//Importacion de iconos
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { faIdBadge } from "@fortawesome/free-solid-svg-icons";

function App() {
  const navArrayLinks = [
    { title: "Inicio", path: "/", icon: faHome },
    { title: "Excursiones", path: "/excursiones", icon: faMap },
    { title: "Experiencias", path: "/experiencias", icon: faBomb },
    { title: "Contacto", path: "/contacto", icon: faIdBadge },
  ];
  return (
    <>
      <div className="">
        <NavBar navArrayLinks={navArrayLinks} />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/excursiones" element={<Excursiones />}></Route>
          <Route path="/contacto" element={<Contacto />}></Route>
          <Route path="/experiencias" element={<Experiencias />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
