import "./App.css";
import { createRoot } from "react-dom/client";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Excursiones from "./pages/Excursiones";
import Contacto from "./pages/Contacto";
import Experiencias from "./pages/Experiencias";
import NavBar from "./components/NavBar/navBar";
import Excursionbusqueda from "./pages/Excursionbusqueda";
import LayOut from "./pages/LayOut";




function App() {
  
  return (
 
     
       <>
      <LayOut></LayOut>
    </>
  );
}

export default App;
