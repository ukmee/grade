import { GoogleGenAI } from "@google/genai";
import { CalculationResult, GradingSystem } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeGrades = async (
  result: CalculationResult,
  gradingSystem: GradingSystem
): Promise<string> => {
  try {
    const prompt = `
      You are an expert academic advisor. Analyze the following student grades and provide a concise, motivating, and actionable report.

      **Context:**
      - Grading System: ${gradingSystem.type} (TD: ${gradingSystem.tdWeight}%, Exam: ${gradingSystem.examWeight}%)
      - Student Semester Average: ${result.average.toFixed(2)} / 20
      - Total Coefficient: ${result.totalCoef}

      **Grades Breakdown:**
      ${result.breakdown.map(m => `- ${m.name}: TD=${m.td}, Exam=${m.exam || 'N/A'}, Final=${m.final.toFixed(2)} (Coef: ${m.coef})`).join('\n')}

      **Instructions:**
      1. **Strengths:** Identify 1-2 top performing modules.
      2. **Weaknesses:** Identify 1-2 modules that need attention (especially if Exam grade < TD grade significantly).
      3. **Strategic Advice:** Give 1 specific tip to improve the average, considering the coefficients.
      
      **Format:**
      Return the response in raw HTML format (using <ul>, <li>, <b> tags) for easy rendering. Do not use Markdown backticks or headers. Keep it short (max 150 words).
      Start directly with the content (e.g., "<b>Strengths:</b>...").
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to generate insights. Please check your connection.");
  }
};
