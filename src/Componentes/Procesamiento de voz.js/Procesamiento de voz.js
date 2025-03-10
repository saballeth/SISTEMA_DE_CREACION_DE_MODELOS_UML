import "../Principal/Principal.css";
import React, { useState } from "react";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Conexion_Principal from "./Conexion_Principal";
function Procesamiento_de_voz({setTeclas}) {
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [teclas, setTeclas] = useState({ arriba: "w", abajo: "s" }); // Estado para las teclas de navegación
  const supportsGeoLocation = navigator.geolocation;

  // Función para texto a voz
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-CO"; // Configura el idioma de la voz
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Tu navegador no soporta síntesis de voz.");
    }
  };

  // Sesión de Procesamiento de Voz
  const commands = [
    {
      command: /(?:\s+\w+){0,3}?\b(Cambiar|Intercambiar|Modificar|Ajustar|Transformar|Alterar|Actualizar|Reemplazar|Sustituir|Adaptar|Convertir|Configurar|Personalizar|Optimizar|Editar|Reconfigurar)\b(?:\s+\w+){0,2}\b(el|la|los|las|su|mi|tu)?\b)(?:\s+\w+){0,1}\b(Movimiento|Interacción|LNOrientación|Desplazamiento|Búsqueda|Exploración|Recorrido|Navegación|Trayectoria|botones|teclado)\b/i,
      callback: (match) => {
        const nuevaTecla = match[1]; // Captura la nueva tecla
        setTeclas((prev) => ({ ...prev, arriba: match[1] }));
        speak(`He cambiado la tecla de arriba a ${nuevaTecla}.`);
      },
    },

    
    {
      command: /cambiar tecla abajo a (\w)/i, // Comando para cambiar la tecla de abajo
      callback: (match) => {
        const nuevaTecla = match[1]; // Captura la nueva tecla
        setTeclas((prev) => ({ ...prev, abajo: nuevaTecla }));
        speak(`He cambiado la tecla de abajo a ${nuevaTecla}.`);
      },
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    commands,
  });

  const startListening = () => {
    resetTranscript();
    setMessage("");
    SpeechRecognition.startListening({
      language: "es-CO", // Configura el idioma a español colombiano
      continuous: true,
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const Icon = listening ? MicIcon : MicOffIcon;

  return (
    <div>
      <Tooltip title={listening ? "Detener escucha" : "Iniciar escucha"}>
        <IconButton onClick={listening ? stopListening : startListening}>
          <Icon />
        </IconButton>
      </Tooltip>
      <div>
        <h2>Preguntas Registradas:</h2>
        <ul>
          {questions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Teclas de Navegación:</h2>
        <p>Tecla para arriba: {teclas.arriba}</p>
        <p>Tecla para abajo: {teclas.abajo}</p>
      </div>
    </div>
  );
}

export default Procesamiento_de_voz;