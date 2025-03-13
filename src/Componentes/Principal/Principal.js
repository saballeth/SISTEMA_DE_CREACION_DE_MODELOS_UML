import React, { useState, useEffect } from "react";
import "./Principal.css";
import Procesamiento_de_voz from "./Procesamiento_de_voz";
import { fetchChatResponse } from "./ai_api"; // ✅ Importa la función corregida

function ComponentePrincipal() {
  const [voiceMessage, setVoiceMessage] = useState(""); 
  const [plantUMLCode, setPlantUMLCode] = useState(""); 

  useEffect(() => {
    if (!voiceMessage) return; 

    console.log("🎙️ Mensaje de voz recibido:", voiceMessage);

    // 🔹 Llamamos a la API para obtener el código UML
    fetchChatResponse(voiceMessage).then(setPlantUMLCode);

  }, [voiceMessage]); 

  return (
    <div className="container">
      <div className="sidebar">
        <Procesamiento_de_voz setVoiceMessage={setVoiceMessage} />
      </div>

      <div className="right-panel">
        <div className="plantuml">
          <h2>Código Plant UML</h2>
          <textarea value={plantUMLCode} readOnly />
        </div>
      </div>
    </div>
  );
}

export default ComponentePrincipal;
