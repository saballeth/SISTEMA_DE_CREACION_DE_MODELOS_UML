import React, { useState, useRef, useEffect } from "react";
import "./Principal.css";
import Procesamiento_de_voz from "../Procesamiento de voz/Procesamiento_de_voz";

function ComponentePrincipal() {
  const [selectedDiagram, setSelectedDiagram] = useState(0);
  const [selectedAction, setSelectedAction] = useState(0);
  const [teclas, setTeclas] = useState({ arriba: "w", abajo: "s", izquierda: "a", derecha: "d" });

  // Referencias para los elementos enfocables
  const diagramRefs = useRef([]);
  const actionRefs = useRef([]);

  const diagrams = [
    "Diagramas de flujo (0)",
    "Diagramas de arquitectura (5)",
    "Diagramas de relaciones (0)",
    "Diagramas de Clases (3)",
  ];

  const actions = ["Crear", "Eliminar", "Editar"];

  // Función para texto a voz con pausas usando espacios
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const phrases = text.split("..."); // Dividir el texto en frases
      const utterance = new SpeechSynthesisUtterance(phrases.join("   ")); // Unir con espacios para pausas
      utterance.lang = "es-MX"; // Configura el idioma de la voz
      utterance.volume = 1; // Asegurar que el volumen esté al máximo
      window.speechSynthesis.cancel(); // Cancela cualquier mensaje pendiente
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Tu navegador no soporta síntesis de voz.");
    }
  };

  // Función para formatear el texto del diagrama
  const formatDiagramText = (diagramText) => {
    // Extraer el número entre paréntesis
    const match = diagramText.match(/\((\d+)\)/);
    const count = match ? parseInt(match[1], 10) : 0;

    // Reemplazar el número con "no hay diagramas aquí" o el número
    const description = count === 0 ? "no hay diagramas aquí" : `hay ${count} diagramas`;
    return diagramText.replace(/\(\d+\)/, description);
  };

  // Función para mover el foco a un diagrama específico
  const focusDiagram = (index) => {
    if (diagramRefs.current[index]) {
      diagramRefs.current[index].focus();
      setSelectedDiagram(index);

      // Formatear el texto del diagrama
      const formattedText = formatDiagramText(diagrams[index]);
      speak(`Estás en ${formattedText}... opción ${actions[selectedAction]}`);
    }
  };

  // Función para mover el foco a una acción específica
  const focusAction = (index) => {
    if (actionRefs.current[index]) {
      actionRefs.current[index].focus();
      setSelectedAction(index);

      // Formatear el texto del diagrama
      const formattedText = formatDiagramText(diagrams[selectedDiagram]);
      speak(`Estás en ${formattedText}... opción ${actions[index]}`);
    }
  };

  // Comandos de voz para mover el foco
  const commands = [
    {
      command: "mover a diagrama de flujo",
      callback: () => focusDiagram(0),
    },
    {
      command: "mover a diagrama de arquitectura",
      callback: () => focusDiagram(1),
    },
    {
      command: "mover a diagrama de relaciones",
      callback: () => focusDiagram(2),
    },
    {
      command: "mover a diagrama de clases",
      callback: () => focusDiagram(3),
    },
    {
      command: "mover a crear",
      callback: () => focusAction(0),
    },
    {
      command: "mover a eliminar",
      callback: () => focusAction(1),
    },
    {
      command: "mover a editar",
      callback: () => focusAction(2),
    },
  ];

  // Efecto para manejar las teclas
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case teclas.arriba:
          focusDiagram((selectedDiagram - 1 + diagrams.length) % diagrams.length);
          break;
        case teclas.abajo:
          focusDiagram((selectedDiagram + 1) % diagrams.length);
          break;
        case teclas.izquierda:
          focusAction((selectedAction - 1 + actions.length) % actions.length);
          break;
        case teclas.derecha:
          focusAction((selectedAction + 1) % actions.length);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [teclas, selectedDiagram, selectedAction]);

  return (
    <div className="container">
      {/* Sidebar con los diagramas */}
      <div className="sidebar">
        <ul>
          {diagrams.map((diagram, index) => (
            <li
              key={index}
              tabIndex={0}
              ref={(el) => (diagramRefs.current[index] = el)}
              className={selectedDiagram === index ? "focused" : ""}
              onFocus={() => focusDiagram(index)}
            >
              {diagram}
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido principal con los botones de acciones */}
      <div className="content">
        <div className="buttons">
          {actions.map((action, index) => (
            <button
              key={index}
              tabIndex={0}
              ref={(el) => (actionRefs.current[index] = el)}
              className={selectedAction === index ? "focused" : ""}
              onFocus={() => focusAction(index)}
            >
              <span>{index === 0 ? '📄' : index === 1 ? '🗑️' : '⚙️'}</span> {action}
            </button>
          ))}
        </div>
      </div>

      {/* Componente de reconocimiento de voz */}
      <Procesamiento_de_voz commands={commands} />
    </div>
  );
}

export default ComponentePrincipal;