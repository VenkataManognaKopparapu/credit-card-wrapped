
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, WrappedData, AiInsight } from '../types';
import { analyzeData } from '../utils/dataAnalyzer';
import { parseCSV } from '../utils/csvParser';
import { processPDF } from './pdfProcessor';
import { MOCK_WRAPPED_DATA } from '../constants';
import { calculateAchievements } from '../utils/achievements';

// This function now orchestrates multi-file analysis (CSV + PDF)
export const processFiles = async (files: File[]): Promise<WrappedData> => {
  console.log("Processing files:", files.length);
  const allTransactions: Transaction[] = [];
  const errors: string[] = [];

  for (const file of files) {
    try {
      let txns: Transaction[] = [];
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (isPdf) {
        console.log(`Processing PDF: ${file.name}`);
        txns = await processPDF(file);
      } else {
        console.log(`Processing CSV: ${file.name}`);
        txns = await parseCSV(file);
      }

      console.log(`Parsed ${txns.length} transactions from ${file.name}`);
      allTransactions.push(...txns);
    } catch (e: any) {
      console.warn(`Failed to parse ${file.name}`, e);
      errors.push(`${file.name}: ${e.message || 'Unknown error'}`);
    }
  }

  if (allTransactions.length === 0) {
    const errorMsg = errors.length > 0 
      ? `Failed to process files:\n${errors.join('\n')}` 
      : "Could not extract any valid transactions from the uploaded files.";
    throw new Error(errorMsg);
  }

  // Deduplication: Remove exact matches on Date, Merchant, and Amount
  const uniqueTransactions: Transaction[] = [];
  const seen = new Set<string>();

  for (const t of allTransactions) {
    // Create a unique signature
    const datePart = t.date.split('T')[0];
    const key = `${datePart}-${t.amount.toFixed(2)}-${t.merchant?.toLowerCase().trim()}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      uniqueTransactions.push(t);
    } else {
      console.log(`Duplicate removed: ${t.description} (${t.amount}) from ${t.source}`);
    }
  }

  console.log("Combined unique transactions:", uniqueTransactions.length);

  // Sort by date (Oldest first)
  uniqueTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // 2. Analyze locally (fast, deterministic)
  const baseData = analyzeData(uniqueTransactions);

  // Calculate achievements locally
  baseData.achievements = calculateAchievements(uniqueTransactions, baseData);

  // 3. Optional: Enhance with Gemini if API key is present
  // For the AI Studio environment demo, we will default to local analysis to ensure stability
  return baseData;
};

// Legacy single file support wrapper
export const processFile = async (file: File): Promise<WrappedData> => {
  return processFiles([file]);
};

// Original mock/demo function
export const analyzeSpending = async (input: string): Promise<WrappedData> => {
   // Legacy support for demo button
   return new Promise(resolve => setTimeout(() => resolve(MOCK_WRAPPED_DATA), 2000));
};

// NEW: Premium Insights Generator (Mocked for Stability but Personalized)
export const generatePremiumInsights = async (data: WrappedData): Promise<AiInsight[]> => {
  console.log("Generating Premium Insights (Mock AI)...");
  
  // Simulate network delay for "AI Thinking" effect
  await new Promise(resolve => setTimeout(resolve, 1500));

  const insights: AiInsight[] = [];
  const potentialInsights: AiInsight[] = [];

  // 1. The "Big Spender" Insight (Based on most expensive purchase)
  if (data.mostExpensivePurchase) {
      potentialInsights.push({
          question: "Remember this 'little' treat? 💸",
          answer: `You dropped $${Math.floor(data.mostExpensivePurchase.amount).toLocaleString()} at ${data.mostExpensivePurchase.merchant}. That was a main character moment. No regrets, right? ...Right? 😅`,
          emoji: "💅",
          tip: "Treat yourself, but maybe hide the receipt next time."
      });
  }

  // 2. The "Frequent Flyer" / Top Merchant Insight
  if (data.topMerchant) {
      const visitFrequency = Math.max(1, Math.round(365 / data.topMerchant.count));
      potentialInsights.push({
          question: "We found your second home... 🏠",
          answer: `You visited ${data.topMerchant.name} ${data.topMerchant.count} times. That's once every ${visitFrequency} days! You've basically paid their rent this year.`,
          emoji: "🏆",
          tip: "Maybe ask for an employee discount?"
      });
  }

  // 3. Category Roast
  if (data.topCategories.length > 0) {
      const topCat = data.topCategories[0];
      potentialInsights.push({
          question: "Your wallet's kryptonite? 🎯",
          answer: `${topCat.name} took ${Math.round(topCat.percentage)}% of your budget! While most people say 'everything in moderation', you said 'everything in ${topCat.name}!'`,
          emoji: "📉",
          tip: "We respect the commitment. Truly."
      });
  }

  // 4. Transaction Frequency / "Do you sleep?"
  const daysPerTxn = Math.round(365 / data.transactionCount);
  if (data.transactionCount > 365) {
      potentialInsights.push({
          question: "Do your cards ever cool down? 🔥",
          answer: `You averaged ${(data.transactionCount / 365).toFixed(1)} transactions PER DAY. Your bank's fraud detection system probably has you on speed dial.`,
          emoji: "💳",
          tip: "Try a 'No Spend Day' challenge. Just one. We believe in you."
      });
  } else {
       potentialInsights.push({
          question: "The Calculated Spender 🧠",
          answer: `You only swipe your card once every ${Math.max(1, daysPerTxn)} days on average. Either you use cash, or you have the self-control of a monk. Teach us.`,
          emoji: "🧘",
          tip: "Keep up the disciplined streak!"
      });
  }

  // 5. Monthly Madness
  if (data.busiestMonth) {
      potentialInsights.push({
          question: `What happened in ${data.busiestMonth}? 📅`,
          answer: `It was your highest spending month. The vibes were immaculate, but your savings account was screaming into the void. 😱`,
          emoji: "🗓️",
          tip: "Plan ahead for this time next year!"
      });
  }

  // 6. Foodie / Delivery specific logic
  // We infer this from category data for now since we don't have raw transactions here
  const isFoodie = data.topCategories.some(c => c.name.includes('Food') || c.name.includes('Dining') || c.name.includes('Restaurant'));
  if (isFoodie) {
       potentialInsights.push({
          question: "The Delivery Dashboard 🛵",
          answer: "Your spending data smells like takeout boxes. We estimate you've ordered enough delivery to memorize the drivers' names. Your doorbell has Stockholm syndrome.",
          emoji: "🍕",
          tip: "Cooking at home is cool too. Allegedly."
      });
  }

  // Pick 3 random unique insights from the potential pool
  const shuffled = potentialInsights.sort(() => 0.5 - Math.random());
  const selectedInsights = shuffled.slice(0, 3);

  console.log("Generated Insights:", selectedInsights);
  return selectedInsights;
};
