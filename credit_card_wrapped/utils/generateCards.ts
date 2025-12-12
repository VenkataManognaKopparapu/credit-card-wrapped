
import { WrappedData, InsightCard, AiInsight, Achievement } from '../types';

export const generateCards = (data: WrappedData): InsightCard[] => {
  const formatCurrency = (amount: number) => 
    `$${Math.floor(amount).toLocaleString()}`;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const initialCards: InsightCard[] = [
    {
      id: 'total-spent',
      question: 'Ready to see the damage? 🫣\nHere is your total spend for the year...',
      answerValue: formatCurrency(data.totalSpent),
      answerDescription: "That is a lot of avocado toast.",
      emoji: '💰',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'transaction-count',
      question: 'How many times did you swipe your card? 💳',
      answerValue: data.transactionCount.toString(),
      answerDescription: 'Transactions processed. Your chip reader is tired.',
      emoji: '🔢',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'average-txn',
      question: 'On average, every time you tapped, you spent...',
      answerValue: formatCurrency(data.averageTransaction),
      answerDescription: 'Per transaction. Could be worse!',
      emoji: '📊',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'most-expensive',
      question: 'What was your biggest splurge? 💸',
      answerValue: formatCurrency(data.mostExpensivePurchase.amount),
      answerDescription: `At ${data.mostExpensivePurchase.merchant} on ${formatDate(data.mostExpensivePurchase.date)}`,
      emoji: '💎',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'top-merchant',
      question: 'You really, really like this place... 🏆',
      answerValue: data.topMerchant.name,
      answerDescription: `You visited ${data.topMerchant.count} times and spent ${formatCurrency(data.topMerchant.amount)}. They should name a sandwich after you.`,
      emoji: '🏪',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      id: 'top-category',
      question: 'Where did most of your money go? 👑',
      answerValue: data.topCategories[0]?.name || 'Everything',
      answerDescription: `Making up ${Math.round(data.topCategories[0]?.percentage || 0)}% of your total spending.`,
      emoji: '🛍️',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      id: 'monthly-champ',
      question: "Which month was your wallet's worst nightmare? 📅",
      answerValue: data.busiestMonth,
      answerDescription: 'The spending was real this month.',
      emoji: '🗓️',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'first-purchase',
      question: 'How did you start your year? 🎯',
      answerValue: data.firstPurchase.merchant,
      answerDescription: `${formatCurrency(data.firstPurchase.amount)} on ${formatDate(data.firstPurchase.date)}. Setting the tone.`,
      emoji: '🏁',
      gradient: 'from-lime-500 to-green-600'
    },
    {
      id: 'last-purchase',
      question: 'And how did you end it? 🏁',
      answerValue: data.lastPurchase.merchant,
      answerDescription: `${formatCurrency(data.lastPurchase.amount)} on ${formatDate(data.lastPurchase.date)}. One last treat.`,
      emoji: '👋',
      gradient: 'from-fuchsia-500 to-pink-600'
    },
    {
      id: 'persona-reveal',
      question: 'Based on your spending, your personality is...',
      answerValue: data.persona.title,
      answerDescription: data.persona.description,
      emoji: data.persona.emoji,
      gradient: 'from-violet-600 to-indigo-600',
      type: 'persona'
    }
  ];

  // Insert Monthly Chart at index 3 (Card 4)
  const monthlyChartCard: InsightCard = {
    id: 'monthly-chart',
    question: 'Your Year at a Glance 📊',
    answerValue: '',
    answerDescription: '',
    emoji: '',
    gradient: 'from-violet-500 to-indigo-500',
    type: 'monthly-chart',
    chartData: data.monthlySpending
  };

  // Insert Category Chart at index 7 (Card 8)
  const categoryChartCard: InsightCard = {
    id: 'category-chart',
    question: 'Where Did It All Go? 💸',
    answerValue: '',
    answerDescription: '',
    emoji: '',
    gradient: 'from-rose-500 to-orange-500',
    type: 'category-chart',
    chartData: data.topCategories
  };

  // Construct card list
  const cards = [...initialCards];
  cards.splice(3, 0, monthlyChartCard);
  cards.splice(7, 0, categoryChartCard);

  if (data.cardBreakdown && data.cardBreakdown.length > 0) {
      const breakdownCard: InsightCard = {
          id: 'card-breakdown',
          question: 'Your Card Arsenal 💳',
          answerValue: '',
          answerDescription: '',
          emoji: '',
          gradient: 'from-emerald-500 to-cyan-600',
          type: 'card-breakdown',
          chartData: data.cardBreakdown
      };
      // Insert breakdown before persona (last)
      cards.splice(cards.length - 1, 0, breakdownCard);
  }

  return cards;
};

// Generate the premium set of cards
export const generatePremiumCards = (
  data: WrappedData, 
  aiInsights: AiInsight[], 
  achievements: Achievement[]
): InsightCard[] => {
  const cards: InsightCard[] = [];

  // Add intro card
  cards.push({
    id: 'premium-intro',
    question: "Here is what we discovered about you...",
    answerValue: 'Premium Insights Unlocked',
    answerDescription: 'Analysis by Gemini AI ✨',
    emoji: '🤖',
    gradient: 'from-violet-600 via-fuchsia-600 to-indigo-600',
    isPremium: true,
    type: 'story-intro'
  });

  // Add AI Insights
  aiInsights.forEach((insight, index) => {
    cards.push({
      id: `ai-insight-${index}`,
      question: insight.question,
      answerValue: insight.answer,
      answerDescription: insight.tip || 'A little wisdom for your wallet.',
      emoji: insight.emoji,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      type: 'ai-insight',
      isPremium: true
    });
  });

  // Add Achievement Grid
  if (achievements.length > 0) {
    cards.push({
      id: 'achievement-grid',
      question: 'Your Spending Badges 🏆',
      answerValue: '',
      answerDescription: '',
      emoji: '',
      gradient: 'from-emerald-500 to-teal-600',
      type: 'achievement-grid',
      chartData: achievements,
      isPremium: true
    });
  }

  return cards;
};
