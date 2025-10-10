import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello",
      temperature: 0.7,
      candidateCount: 1,
      maxOutputTokens: 50,
    });
    console.log(res);
  } catch (err) {
    console.error("Gemini test failed:", err);
  }
}

main();
