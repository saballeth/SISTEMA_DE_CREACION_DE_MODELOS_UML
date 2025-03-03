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
  const [message, setMessage] = useState();
  const supporstGeoLocation = navigator.geolocation;

  const commands = [
    {
      command: "what time is it",
      callback: () => {
        const currentDate = new Date();
        setMessage(`Current time is: ${currentDate.toISOString()}`);
      },
    },
    {
      command: [
        "I would like to order * (please)",
        "I want to order * (please)",
        "Can I get * (please)",
      ],
      callback: (comida) => setMessage(`Cooking ${comida}`),
    },
  ];

  if (supporstGeoLocation) {
    commands.push({
      command: "where am I",
      callback: () => {
        navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setMessage(`Latitud: ${latitude}, Longitud: ${longitude}`);
        });
      },
    });
  }

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
    setMessage();
    SpeechRecognition.startListening({
      // Comandos no funcionan con es-HN
      // language: "es-HN",
      continuous: true,
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Broswer is not supported!</div>;
  }

  const Icon = listening ? MicIcon : MicOffIcon;

  return (
    <div className="App">
      <header className="App-header">
        <Tooltip
          title={
            listening
              ? "Listening..."
              : "Keep button pressed to start listening"
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