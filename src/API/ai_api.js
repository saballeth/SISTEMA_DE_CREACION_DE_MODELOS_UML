import React, { useState } from "react";
import { fetchChatResponse } from "./deepseek_service";

const Chat = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    setLoading(true);
    setChatResponse("Loading...");
    console.log("Sending message:", userMessage);

    try {
      const response = await fetchChatResponse(userMessage);
      console.log("OpenRouter response:", response);
      setChatResponse(response);
    } catch (error) {
      setChatResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>OpenRouter Chat</h1>
      <textarea
        rows="4"
        cols="50"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <br />
      <button onClick={handleSendMessage} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
      <div style={{ marginTop: "20px" }}>
        <h3>Response (PlantUML Code):</h3>
        <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
          <code>{chatResponse}</code>
        </pre>
      </div>
    </div>
  );
};

export default Chat;
