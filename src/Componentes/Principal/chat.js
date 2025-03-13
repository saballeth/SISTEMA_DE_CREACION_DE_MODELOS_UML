import React, { useState, useEffect } from "react";
import { fetchChatResponse } from "./deepseek_service";

const Chat = ({ voiceMessage }) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (voiceMessage) {
      setUserMessage(voiceMessage);
      handleSendMessage(voiceMessage);
    }
  }, [voiceMessage]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) {
      setError("⚠️ No se agregó ningún mensaje.");
      return;
    }

    setLoading(true);
    setChatResponse("");
    setError(null);

    console.log("📤 Enviando mensaje:", message);

    try {
      const response = await fetchChatResponse(message);
      console.log("✅ Respuesta de la API:", response);
      setChatResponse(response || "⚠️ No se recibió respuesta válida.");
    } catch (error) {
      console.error("❌ Error al llamar a la API:", error);
      setError("❌ Ocurrió un error al procesar tu solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h1>💬 OpenRouter Chat</h1>

      <textarea
        rows="4"
        cols="50"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Escribe tu mensaje aquí..."
        style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" }}
      />

      <br />
      <button
        onClick={() => handleSendMessage(userMessage)}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

      <div style={{ marginTop: "20px", textAlign: "left" }}>
        <h3>📜 Respuesta (PlantUML Code):</h3>
        <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px", whiteSpace: "pre-wrap" }}>
          <code>{chatResponse || "No hay respuesta aún."}</code>
        </pre>
      </div>
    </div>
  );
};

export default Chat;
