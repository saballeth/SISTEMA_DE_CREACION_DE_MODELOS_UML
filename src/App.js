import "./App.css";

import React, { useState } from "react";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function App() {
  const [message, setMessage] = useState("");
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

  // Comandos en español colombiano
  const commands = [
    {
      command: "¿Qué hora es?",
      callback: () => {
        const currentDate = new Date();
        const time = currentDate.toLocaleTimeString("es-CO");
        const response = `La hora actual es: ${time}`;
        setMessage(response);
        speak(response); // Responde con voz
      },
    },
    {
      command: [
        "Quiero pedir * (por favor)",
        "Me gustaría pedir * (por favor)",
        "¿Puedo obtener *? (por favor)",
      ],
      callback: (comida) => {
        const response = `Preparando ${comida}`;
        setMessage(response);
        speak(response); // Responde con voz
      },
    },
    {
      command: "¿Dónde estoy?",
      callback: () => {
        if (supportsGeoLocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              const response = `Estás en Latitud: ${latitude}, Longitud: ${longitude}`;
              setMessage(response);
              speak(response); // Responde con voz
            },
            (error) => {
              const errorMessage =
                "No se pudo obtener la ubicación. Asegúrate de permitir el acceso a la geolocalización.";
              setMessage(errorMessage);
              speak(errorMessage); // Responde con voz
            }
          );
        } else {
          const errorMessage = "Geolocalización no soportada en este navegador.";
          setMessage(errorMessage);
          speak(errorMessage); // Responde con voz
        }
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

  if (!browserSupportsSpeechRecognition) {
    return <div>¡Tu navegador no soporta reconocimiento de voz!</div>;
  }

  const Icon = listening ? MicIcon : MicOffIcon;

  return (
    <div className="App">
      <header className="App-header">
        <Tooltip
          title={
            listening
              ? "Escuchando..."
              : "Mantén presionado el botón para empezar a escuchar"
          }
        >
          <IconButton
            className="mic-button"
            color="primary"
            aria-label="listen"
            size="large"
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            onTouchCancel={stopListening}
          >
            <Icon className="mic-icon" />
          </IconButton>
        </Tooltip>
        {transcript && <div>{transcript}</div>}
        {message && <div>{message}</div>}
      </header>
    </div>
  );
}

export default App;