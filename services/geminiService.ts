import { GoogleGenAI } from "@google/genai";
import { SheetData } from '../types';

// Ensure API key is present; simplified check for demo
const API_KEY = process.env.API_KEY || ''; 

export class GeminiService {
  private ai: GoogleGenAI;
  private modelId = 'gemini-2.5-flash-latest'; // Good balance for speed/reasoning

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async analyzeData(sheet: SheetData, prompt: string): Promise<string> {
    if (!API_KEY) return "Error: API Key is missing.";

    // Convert sheet data to a simplified CSV-like string for context
    const context = this.sheetToContext(sheet);

    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `
          You are an expert Data Analyst in a spreadsheet application called Abacus.
          Here is a snippet of the current active sheet data (CSV format):
          ---
          ${context}
          ---
          User Request: ${prompt}
          
          Provide a concise, helpful answer. If the user asks for a formula, provide just the formula or a very brief explanation.
        `,
      });
      
      return response.text || "No response generated.";
    } catch (error: any) {
      console.error("Gemini Error:", error);
      return `Error: ${error.message}`;
    }
  }

  async generateFormula(description: string): Promise<string> {
    if (!API_KEY) return "";
    
    try {
       const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `Generate a spreadsheet formula for: "${description}". Return ONLY the formula starting with =, no markdown.`
       });
       return response.text?.trim() || "";
    } catch (e) {
      return "";
    }
  }

  // Convert sparse cell map to a CSV representation for the AI context
  private sheetToContext(sheet: SheetData): string {
    // Find bounds
    const cells = Object.keys(sheet.cells);
    if (cells.length === 0) return "Sheet is empty.";

    // Simple bounds calculation
    let maxRow = 0;
    let maxColIdx = 0;

    cells.forEach(key => {
       const row = parseInt(key.match(/[0-9]+/)?.[0] || '1');
       const col = key.match(/[A-Z]+/)?.[0] || 'A';
       // We'll approximate col index simply for this demo context
       // to avoid importing the Engine logic here to avoid circular deps if not careful
       // For minimal context, we just list non-empty values
    });

    // Instead of full grid, let's just list non-empty cells for token efficiency
    return cells.map(key => `${key}: ${sheet.cells[key].value}`).join('\n');
  }
}

export const geminiService = new GeminiService();