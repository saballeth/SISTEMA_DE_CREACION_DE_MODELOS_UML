import React, { useState, useEffect } from "react";
import "./Principal.css"; // Asegúrate de que la ruta sea correcta

function ComponentePrincipal() {
  const [selectedDiagram, setSelectedDiagram] = useState(0); // Índice del diagrama seleccionado
  const [selectedAction, setSelectedAction] = useState(0); // Índice de la acción seleccionada

  const diagrams = [
    "Diagramas de flujo (0)",
    "Diagramas de arquitectura (0)",
    "Diagramas de relaciones (0)",
    "Diagramas de Clases (0)",
  ];

  const actions = ["Crear", "Eliminar", "Editar"];   

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "w": // Mover hacia arriba en los diagramas
        setSelectedDiagram((prev) => Math.max(prev - 1, 0));
        break;
      case "s": // Mover hacia abajo en los diagramas
        setSelectedDiagram((prev) => Math.min(prev + 1, diagrams.length - 1));
        break;
        case "d": // Mover hacia la derecha en las acciones
        setSelectedAction((prev) => Math.max(prev - 1, 0));
        break;
      case "a": // Mover hacia la izquierda en las acciones
        setSelectedAction((prev) => Math.min(prev + 1, actions.length - 1));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <ul>
          {diagrams.map((diagram, index) => (
            <li key={index} style={{ fontWeight: selectedDiagram === index ? 'bold' : 'normal' }}>
              {diagram}
            </li>
          ))}
        </ul>
      </div>
      <div className="content">
        <div className="buttons">
          {actions.map((action, index) => (
            <button key={index} style={{ backgroundColor: selectedAction === index ? 'lightgray' : 'white' }}>
              <span>{index === 0 ? '📄' : index === 1 ? '🗑️' : '⚙️'}</span> {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ComponentePrincipal;