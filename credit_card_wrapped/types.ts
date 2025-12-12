
export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
  merchant?: string; // Derived from description
  source?: string; // Filename or card identifier
}

export interface SpendingCategory {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface CardBreakdown {
  cardName: string;
  amount: number;
  percentage: number;
}

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
  progress?: string;
}

export interface AiInsight {
  question: string;
  answer: string;
  emoji: string;
  tip?: string;
}

export interface WrappedData {
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategories: SpendingCategory[];
  topMerchant: { name: string; amount: number; count: number };
  busiestMonth: string;
  monthlySpending: number[]; // Array of 12 numbers (Jan-Dec)
  mostExpensivePurchase: { merchant: string; amount: number; date: string };
  firstPurchase: { merchant: string; amount: number; date: string };
  lastPurchase: { merchant: string; amount: number; date: string };
  cardBreakdown?: CardBreakdown[];
  persona: {
    title: string;
    description: string;
    roast: string;
    emoji: string;
  };
  achievements?: Achievement[]; // Added for premium
}

export interface InsightCard {
  id: string;
  question: string;
  answerValue: string;
  answerDescription: string;
  emoji: string;
  gradient: string;
  type?: 'stats' | 'merchant' | 'category' | 'persona' | 'monthly-chart' | 'category-chart' | 'card-breakdown' | 'achievement-grid' | 'ai-insight' | 'story-intro';
  chartData?: any;
  isPremium?: boolean; // Added for styling
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppState {
  LANDING,
  ANALYZING,
  WRAPPED,
}

export type WrappedSection = 'regular' | 'chatbot' | 'unlock' | 'loading' | 'ai-story' | 'achievement' | 'complete';
