
import { Transaction, WrappedData, SpendingCategory, CardBreakdown } from '../types';
import { COLORS } from '../constants';

export const analyzeData = (transactions: Transaction[]): WrappedData => {
  let totalSpent = 0;
  const monthlySpending = new Array(12).fill(0);
  const merchantMap = new Map<string, { count: number; amount: number }>();
  const categoryMap = new Map<string, number>();
  const sourceMap = new Map<string, number>();
  
  // Sort transactions by date (already likely sorted, but ensuring safety)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let mostExpensivePurchase = { merchant: '', amount: 0, date: '' };

  sortedTransactions.forEach(t => {
    totalSpent += t.amount;

    // Monthly Spending
    const month = new Date(t.date).getMonth();
    monthlySpending[month] += t.amount;

    // Merchant Stats
    const merchant = t.merchant || t.description;
    const currentMerchant = merchantMap.get(merchant) || { count: 0, amount: 0 };
    merchantMap.set(merchant, {
      count: currentMerchant.count + 1,
      amount: currentMerchant.amount + t.amount
    });

    // Category Stats
    const category = categorizeTransaction(t);
    categoryMap.set(category, (categoryMap.get(category) || 0) + t.amount);

    // Source Stats (Card Breakdown)
    if (t.source) {
      sourceMap.set(t.source, (sourceMap.get(t.source) || 0) + t.amount);
    }

    // Most Expensive
    if (t.amount > mostExpensivePurchase.amount) {
      mostExpensivePurchase = { merchant, amount: t.amount, date: t.date };
    }
  });

  // Top Merchant
  let topMerchant = { name: '', amount: 0, count: 0 };
  merchantMap.forEach((value, key) => {
    if (value.amount > topMerchant.amount) {
      topMerchant = { name: key, amount: value.amount, count: value.count };
    }
  });

  // Top Categories
  const topCategories: SpendingCategory[] = Array.from(categoryMap.entries())
    .map(([name, amount], index) => ({
      name,
      amount,
      percentage: (amount / totalSpent) * 100,
      color: COLORS[index % COLORS.length]
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  
  // Card Breakdown
  const cardBreakdown: CardBreakdown[] = Array.from(sourceMap.entries())
    .map(([cardName, amount]) => ({
      cardName,
      amount,
      percentage: (amount / totalSpent) * 100
    }))
    .sort((a, b) => b.amount - a.amount);

  // Busiest Month
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const busiestMonthIndex = monthlySpending.indexOf(Math.max(...monthlySpending));
  const busiestMonth = monthNames[busiestMonthIndex];

  // First and Last Purchase
  const firstPurchase = {
    merchant: sortedTransactions[0]?.merchant || '',
    amount: sortedTransactions[0]?.amount || 0,
    date: sortedTransactions[0]?.date || ''
  };
  const lastPurchase = {
    merchant: sortedTransactions[sortedTransactions.length - 1]?.merchant || '',
    amount: sortedTransactions[sortedTransactions.length - 1]?.amount || 0,
    date: sortedTransactions[sortedTransactions.length - 1]?.date || ''
  };

  // Generate Persona
  const persona = generatePersona(topCategories[0]?.name || 'General', totalSpent, sortedTransactions.length);

  return {
    totalSpent,
    transactionCount: transactions.length,
    averageTransaction: totalSpent / transactions.length,
    topCategories,
    topMerchant,
    busiestMonth,
    monthlySpending,
    mostExpensivePurchase,
    firstPurchase,
    lastPurchase,
    cardBreakdown,
    persona
  };
};

const categorizeTransaction = (t: Transaction): string => {
  if (t.category) return t.category;
  
  const desc = t.description.toLowerCase();
  
  if (desc.includes('uber') || desc.includes('lyft') || desc.includes('gas') || desc.includes('shell') || desc.includes('parking')) return 'Travel & Transport';
  if (desc.includes('market') || desc.includes('whole foods') || desc.includes('trader joes') || desc.includes('safeway') || desc.includes('kroger')) return 'Groceries';
  if (desc.includes('restaurant') || desc.includes('cafe') || desc.includes('coffee') || desc.includes('starbucks') || desc.includes('doordash') || desc.includes('grubhub')) return 'Food & Drink';
  if (desc.includes('amazon') || desc.includes('target') || desc.includes('walmart')) return 'Shopping';
  if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('cinema') || desc.includes('hbo')) return 'Entertainment';
  
  return 'General';
};

const generatePersona = (topCategory: string, totalSpent: number, count: number) => {
  // Simple rule-based persona generation
  const personas: Record<string, any> = {
    'Food & Drink': {
      title: 'The Foodie',
      description: 'Your kitchen is pristine because you never use it. Your delivery drivers are your best friends.',
      roast: "You spent enough on takeout to fund a small restaurant.",
      emoji: '🍔'
    },
    'Travel & Transport': {
      title: 'The Jetsetter',
      description: 'Always on the move. Your home is just a place you store your suitcase.',
      roast: 'Your carbon footprint is visible from space.',
      emoji: '✈️'
    },
    'Shopping': {
      title: 'The Shopaholic',
      description: 'Click. Buy. Repeat. The dopamine hit of a delivery notification is your favorite feeling.',
      roast: 'Your local delivery guy probably thinks you run a warehouse.',
      emoji: '🛍️'
    },
    'Groceries': {
      title: 'The Master Chef',
      description: 'You actually cook at home? In this economy? We are impressed.',
      roast: 'You bought enough kale to feed a rabbit colony.',
      emoji: '🥦'
    },
    'Entertainment': {
      title: 'The Entertainer',
      description: 'You know how to have a good time. Life is a movie and you bought the front row tickets.',
      roast: 'You subscribe to services you forgot you had in 2019.',
      emoji: '🎬'
    },
    'General': {
      title: 'The Mystery Spender',
      description: 'Your spending is as mysterious as it is vast. A true enigma of the financial world.',
      roast: "We do not even know what you bought, but you sure bought a lot of it.",
      emoji: '🕵️'
    }
  };

  return personas[topCategory] || personas['General'];
};
