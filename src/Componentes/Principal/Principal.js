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
      const phrases = text.split("...");
      const utterance = new SpeechSynthesisUtterance(phrases.join("   "));
      utterance.lang = "es-MX";
      utterance.volume = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Tu navegador no soporta síntesis de voz.");
    }
  };

  // Función para formatear el texto del diagrama
  const formatDiagramText = (diagramText) => {
    const match = diagramText.match(/\((\d+)\)/);
    const count = match ? parseInt(match[1], 10) : 0;
    const description = count === 0 ? "no hay diagramas aquí" : `hay ${count} diagramas`;
    return diagramText.replace(/\(\d+\)/, description);
  };

  // Mover foco a un diagrama
  const focusDiagram = (index) => {
    if (diagramRefs.current[index]) {
      diagramRefs.current[index].focus();
      setSelectedDiagram(index);

      const formattedText = formatDiagramText(diagrams[index]);
      speak(`Estás en ${formattedText}... opción ${actions[selectedAction]}`);
    }
  };

  // Mover foco a una acción
  const focusAction = (index) => {
    if (actionRefs.current[index]) {
      actionRefs.current[index].focus();
      setSelectedAction(index);

      const formattedText = formatDiagramText(diagrams[selectedDiagram]);
      speak(`Estás en ${formattedText}... opción ${actions[index]}`);
    }
  };

  // Comandos de voz
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

  // Manejo de teclas
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
      {/* Barra lateral (fondo oscuro) con botones + lista de diagramas + micrófono */}
      <div className="sidebar">
        {/* Botones de acciones */}
        <div className="buttons">
          {actions.map((action, index) => (
            <button
              key={index}
              tabIndex={0}
              ref={(el) => (actionRefs.current[index] = el)}
              className={selectedAction === index ? "focused" : ""}
              onFocus={() => focusAction(index)}
            >
              <span>{index === 0 ? "📄" : index === 1 ? "🗑️" : "⚙️"}</span> {action}
            </button>
          ))}
        </div>

        {/* Lista de diagramas */}
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

        {/* Micrófono al final de la barra lateral */}
        <Procesamiento_de_voz commands={commands} />
      </div>

      {/* Área central (fondo blanco) - Podrías mostrar aquí tus diagramas */}
      <div className="content">
        {/* Solo un espacio en blanco por ahora */}
      </div>

      {/* Panel derecho (fondo gris) con Explorador + Código Plant UML */}
      <div className="right-panel">
        <div className="explorer">
          <h2>Explorador</h2>
          <p>Diagrama seleccionado: {diagrams[selectedDiagram]}</p>
        </div>
        <div className="plantuml">
          <h2>Código Plant UML</h2>
          <textarea placeholder="Aquí saldra tu codigo UML..." />
        </div>
      </div>
    </div>
  );
}

export default ComponentePrincipal;
