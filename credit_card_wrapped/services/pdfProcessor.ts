
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from '../types';

export const processPDF = async (file: File): Promise<Transaction[]> => {
  try {
    console.log(`Starting PDF processing for: ${file.name}`);
    
    // 1. Convert File to Base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // 2. Initialize Gemini
    // API Key is assumed to be available in process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // 3. Call Gemini Model
    // gemini-2.5-flash is efficient and supports multimodal input (PDF)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data
            }
          },
          {
            text: `Extract all financial transactions from this bank statement. 
            Return a JSON array where each object has:
            - date (string, YYYY-MM-DD format)
            - description (string, merchant name or transaction description)
            - amount (number, absolute positive value)
            - category (string, infer from description e.g., Food, Shopping, Transport, Utilities, etc.)
            
            Ignore headers, footers, account info, page numbers, and summary tables. 
            If a transaction has a negative sign, treat it as spending (positive amount). 
            Ignore payments/credits TO the account (like "Payment Received").
            Only return the JSON.`
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              description: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              category: { type: Type.STRING }
            }
          }
        }
      }
    });

    // 4. Parse and Validate Response
    if (!response.text) {
      throw new Error("No response from AI");
    }

    const rawData = JSON.parse(response.text);

    if (!Array.isArray(rawData)) {
      throw new Error("AI did not return an array");
    }

    const transactions: Transaction[] = rawData.map((item: any) => ({
      date: item.date,
      description: item.description || 'Unknown Transaction',
      merchant: item.description ? item.description.split('*')[0].trim() : 'Unknown',
      amount: Number(item.amount) || 0,
      category: item.category,
      source: file.name
    })).filter(t => t.amount > 0 && t.date); // Basic validation

    if (transactions.length === 0) {
      throw new Error("No valid transactions found in PDF analysis.");
    }

    return transactions;

  } catch (error: any) {
    console.error("PDF Processing Error:", error);
    if (error.message?.includes('400')) {
       throw new Error(`Could not process ${file.name}. The file might be corrupted or password protected.`);
    }
    throw error;
  }
};
