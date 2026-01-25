
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const polishStoryContent = async (content) => {
  if (!process.env.API_KEY) return content;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional editor. Please improve the following story content for better flow, vocabulary, and engagement while keeping the original meaning intact: \n\n ${content}`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || content;
  } catch (error) {
    console.error("Gemini Error:", error);
    return content;
  }
};

export const generateExcerpt = async (content) => {
  if (!process.env.API_KEY) return content.substring(0, 150) + "...";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following story in exactly one compelling sentence (maximum 150 characters): \n\n ${content}`,
    });
    return response.text?.trim() || content.substring(0, 150) + "...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return content.substring(0, 150) + "...";
  }
};


