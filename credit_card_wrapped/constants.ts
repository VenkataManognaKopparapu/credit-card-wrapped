
import { WrappedData } from './types';

export const MOCK_WRAPPED_DATA: WrappedData = {
  totalSpent: 24589.42,
  transactionCount: 432,
  averageTransaction: 56.92,
  topCategories: [
    { name: 'Dining & Drinks', amount: 6420.50, color: '#e91e63', percentage: 26.11 },
    { name: 'Shopping', amount: 5100.20, color: '#8e44ad', percentage: 20.74 },
    { name: 'Travel', amount: 3200.00, color: '#f1c40f', percentage: 13.01 },
    { name: 'Groceries', amount: 2800.15, color: '#1ed760', percentage: 11.39 },
    { name: 'Entertainment', amount: 1500.00, color: '#e67e22', percentage: 6.10 },
  ],
  topMerchant: {
    name: 'Uber Eats',
    amount: 1240.50,
    count: 48
  },
  busiestMonth: 'December',
  monthlySpending: [1800, 1900, 1750, 2100, 2000, 2200, 1950, 2300, 2100, 2400, 2800, 1289.42],
  mostExpensivePurchase: { merchant: 'Apple Store', amount: 1299.00, date: '2024-11-15' },
  firstPurchase: { merchant: 'Starbucks', amount: 5.50, date: '2024-01-01' },
  lastPurchase: { merchant: 'Uber', amount: 12.50, date: '2024-12-31' },
  cardBreakdown: [
    { cardName: 'Chase Sapphire', amount: 12500.42, percentage: 50.8 },
    { cardName: 'Amex Gold', amount: 8000.00, percentage: 32.5 },
    { cardName: 'Capital One', amount: 4089.00, percentage: 16.7 }
  ],
  persona: {
    title: 'The Impulse Buyer',
    description: 'You see it, you like it, you buy it. Your credit card is faster than your second thoughts.',
    roast: 'Your savings account is begging for mercy, but at least your delivery driver knows you by name.',
    emoji: '🛍️'
  },
  // Hardcoded achievements for Demo Mode
  achievements: [
      { id: 'first-step', name: 'First Step', emoji: '🎯', description: 'You made your first purchase. The journey begins!', earned: true, progress: 'Unlocked' },
      { id: 'explorer', name: 'Spending Explorer', emoji: '🗺️', description: 'You are getting the hang of this.', earned: true, progress: '432/5' },
      { id: 'weekend', name: 'Weekend Warrior', emoji: '🎉', description: 'Living for the weekend.', earned: true, progress: 'Unlocked' },
      { id: 'coffee', name: 'Coffee Connoisseur', emoji: '☕', description: 'Fueling the economy, one latte at a time.', earned: true, progress: '42/5' },
      { id: 'tech', name: 'Tech Titan', emoji: '💻', description: 'You love your gadgets.', earned: true, progress: '$2500/$500' },
      { id: 'foodie', name: 'Certified Foodie', emoji: '🍔', description: 'Food is your love language.', earned: true, progress: 'Unlocked' },
      { id: 'saver', name: 'Smart Saver', emoji: '💚', description: 'Keeping those transaction averages low.', earned: false, progress: 'Avg: $56' },
      { id: 'flyer', name: 'Frequent Flyer', emoji: '✈️', description: 'Catching flights, not feelings.', earned: true, progress: '12/3' },
      { id: 'home', name: 'Home Improver', emoji: '🔨', description: 'Building your dream home.', earned: false, progress: '$150/$200' },
      { id: 'fashion', name: 'Fashionista', emoji: '👗', description: 'Dressed to impress.', earned: true, progress: '$900/$300' },
      { id: 'fitness', name: 'Fitness Fan', emoji: '💪', description: 'Gains for days.', earned: true, progress: 'Unlocked' },
      { id: 'big-spender', name: 'Big Spender', emoji: '💎', description: 'You made a single purchase over $1000.', earned: true, progress: '$1299/$1000' }
  ].sort((a, b) => (a.earned === b.earned ? 0 : a.earned ? -1 : 1))
};

export const COLORS = ['#e91e63', '#8e44ad', '#f1c40f', '#1ed760', '#e67e22', '#3498db'];
