import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { API_KEY, GEMINI_TEXT_MODEL } from '../constants'; // API_KEY is now from import.meta.env via constants

if (!API_KEY) {
  console.warn("API_KEY for Gemini (VITE_API_KEY) is not set. Please ensure the VITE_API_KEY environment variable is configured in your .env file or deployment settings.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Initialize with VITE_API_KEY

export const generateContent = async (prompt: string | Part | (string | Part)[]): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Please check server logs or environment variables (VITE_API_KEY).";
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: typeof prompt === 'string' 
                ? prompt 
                : { parts: Array.isArray(prompt) ? prompt.map(p => typeof p === 'string' ? {text: p} : p) : [prompt] },
      config: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            return "Error: The provided API key is not valid. Please check your VITE_API_KEY.";
        }
         if (error.message.includes('quota')) {
            return "Error: API quota exceeded. Please try again later.";
        }
    }
    return "Error generating content. Please try again later.";
  }
};

export const generateJsonContent = async <T,>(prompt: string, systemInstruction?: string): Promise<T | null> => {
  if (!API_KEY) {
    console.warn("API Key (VITE_API_KEY) not configured for JSON content generation.");
    return null;
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt, // Simplified for string prompt
      config: {
        responseMimeType: "application/json",
        temperature: 0.5, 
        ...(systemInstruction && { systemInstruction }), // Correct: systemInstruction is string
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    return JSON.parse(jsonStr) as T;

  } catch (error) {
    console.error("Error generating JSON content with Gemini:", error);
    return null;
  }
};

export default ai;