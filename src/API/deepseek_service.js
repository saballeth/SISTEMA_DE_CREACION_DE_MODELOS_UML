/*import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.REACT_APP_API_DEEPSEEK, 
  dangerouslyAllowBrowser: true, 
});

export const fetchChatResponse = async (message) => {
  console.log("Sending request to OpenRouter...");

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-r1-distill-qwen-32b:free",
      messages: [
        { role: "system", content: "You are a translator from natural language to PlantUML code. It only responds with the PlantUML code between @startuml and @enduml without any extra text. It responds only when a UML diagram is requested." },
        { role: "user", content: message },
      ],
      extra_headers: {
        "HTTP-Referer": "http://gidsycuml.com",
        "X-Title": "SEMILLERP GIDSYC", 
      },
    });

    return completion.choices?.[0]?.message?.content || "No response";
  } catch (error) {
    console.error("Error fetching chat response:", error);
    return "An error occurred. Please try again.";
  }
};*/