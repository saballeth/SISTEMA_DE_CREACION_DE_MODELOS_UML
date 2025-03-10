import React, { useState } from "react";
import Procesamiento_de_voz from "./Procesamiento de voz";
import ComponentePrincipal from "../Principal/Principal";

function App() {
  const [teclas, setTeclas] = useState({
    arriba: "w",
    abajo: "s",
    izquierda: "a",
    derecha: "d",
  });

  return (
    <div>
      <Procesamiento_de_voz setTeclas={setTeclas} />
      <ComponentePrincipal teclas={teclas} />
    </div>
  );
}

export default App;
