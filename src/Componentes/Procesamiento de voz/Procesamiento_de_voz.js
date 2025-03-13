import React from "react";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function Procesamiento_de_voz({ commands }) {
  const [listening, setListening] = React.useState(false);

  // Hook de reconocimiento de voz
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

  // Verificar si el navegador soporta reconocimiento de voz
  if (!browserSupportsSpeechRecognition) {
    return <div>Tu navegador no soporta reconocimiento de voz.</div>;
  }

  // Función para iniciar la escucha
  const startListening = () => {
    resetTranscript();
    setListening(true);
    SpeechRecognition.startListening({
      language: "es-MX",
      continuous: true,
    });
  };

  // Función para detener la escucha
  const stopListening = () => {
    setListening(false);
    SpeechRecognition.stopListening();
  };

  const Icon = listening ? MicIcon : MicOffIcon;

  return (
    <div className="microphone-container">
      {/* Botón del micrófono */}
      <Tooltip title={listening ? "Detener escucha" : "Iniciar escucha"}>
        <IconButton
          onClick={listening ? stopListening : startListening}
          className="microphone-button"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            padding: "15px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
            },
          }}
        >
          <Icon style={{ fontSize: "2rem", color: listening ? "green" : "red" }} />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default Procesamiento_de_voz;