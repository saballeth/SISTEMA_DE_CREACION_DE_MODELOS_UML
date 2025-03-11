import React, { useState } from "react";
import Procesamiento_de_voz from "./Procesamiento_de_voz";
import ComponentePrincipal from "../Principal/Principal";

function Conexion_principal() {
  const [teclas, setTeclas] = useState({
    arriba: "w",
    abajo: "s",
    izquierda: "a",
    derecha: "d",
  });

  return (
    <div>
      <ComponentePrincipal teclas={teclas} />
      <Procesamiento_de_voz setTeclas={setTeclas} />
    </div>
  );
}

export default Conexion_principal;