
import { GoogleGenAI } from "@google/genai";
import { WrappedData, ChatMessage } from '../types';

export const createFinancialAdvisor = (data: WrappedData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct the system context from the user's data
  const topCats = data.topCategories.slice(0, 5).map(c => 
    `- ${c.name}: $${Math.floor(c.amount)} (${Math.round(c.percentage)}%)`
  ).join('\n');

  const merchantSummary = `${data.topMerchant.name} ($${Math.floor(data.topMerchant.amount)}, ${data.topMerchant.count} visits)`;
  
  const systemInstruction = `You are a friendly, encouraging AI Financial Advisor analyzing this user's 2024 spending data.

SPENDING SUMMARY:
- Total spent: $${data.totalSpent.toFixed(2)}
- Monthly average: $${(data.totalSpent / 12).toFixed(2)}
- Transaction count: ${data.transactionCount}
- Average transaction: $${data.averageTransaction.toFixed(2)}
- Top Categories:
${topCats}
- Top Merchant: ${merchantSummary}
- Busiest Month: ${data.busiestMonth}
- Biggest Purchase: $${data.mostExpensivePurchase.amount} at ${data.mostExpensivePurchase.merchant}
- Spending Persona: ${data.persona.title} ("${data.persona.description}")

YOUR GOAL:
Give personalized, actionable financial advice based on this data.
- Explain WHY patterns matter using their actual numbers.
- Suggest SPECIFIC changes.
- Calculate potential savings where possible.
- Be friendly, conversational, and encouraging (not judgmental).
- Keep responses concise (under 150 words).
- Use formatting (bullet points) for readability.

If asked about savings, look for frequent small purchases (like the top merchant count) or large categories like Dining.
If asked about leaks, point out high frequency vs value.

Start by being helpful.`;

  // Create a chat session
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    }
  });

  return {
    sendMessage: async (message: string): Promise<string> => {
      try {
        const result = await chat.sendMessage({ message });
        return result.text || "I'm having trouble analyzing that right now. Could you ask in a different way?";
      } catch (error) {
        console.error("Chat Error:", error);
        return "Sorry, I'm having trouble connecting to my financial brain right now. Please try again in a moment.";
      }
    }
  };
};
