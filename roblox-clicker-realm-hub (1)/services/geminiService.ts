
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { API_KEY, GEMINI_TEXT_MODEL } from '../constants'; // Explicit import

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. Please ensure the process.env.API_KEY environment variable is configured.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

export const generateContent = async (prompt: string | Part | (string | Part)[]): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Please check server logs.";
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: typeof prompt === 'string' ? [{ role: "user", parts: [{text: prompt}] }] : (Array.isArray(prompt) ? [{ role: "user", parts: prompt.map(p => typeof p === 'string' ? {text: p} : p)}] : [{role: "user", parts: [prompt]}]),
      config: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    // Consider more specific error messages based on error type
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            return "Error: The provided API key is not valid. Please check your configuration.";
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
    console.warn("API Key not configured for JSON content generation.");
    return null;
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [{ role: "user", parts: [{text: prompt}] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.5, // Lower temperature for more deterministic JSON
        ...(systemInstruction && { systemInstruction }),
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
    