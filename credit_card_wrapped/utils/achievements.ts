
import { Transaction, Achievement, WrappedData } from '../types';

export const calculateAchievements = (transactions: Transaction[], data: WrappedData): Achievement[] => {
  const achievements: Achievement[] = [];
  const totalTxns = transactions.length;

  console.log(`--- BADGE CALCULATION START ---`);
  console.log(`Total transactions provided: ${totalTxns}`);
  
  // Debugging: Log first few transactions to verify structure
  if (totalTxns > 0) {
    console.log("Sample transaction:", transactions[0]);
  }

  // --- EASY BADGES ---

  // 1. First Step
  const firstStepEarned = totalTxns >= 1;
  console.log(`Badge [First Step]: ${firstStepEarned} (Count: ${totalTxns})`);
  
  achievements.push({
    id: 'first-step',
    name: 'First Step',
    emoji: '🎯',
    description: 'You made your first purchase. The journey begins!',
    earned: firstStepEarned,
    progress: firstStepEarned ? 'Unlocked' : '0/1'
  });

  // 2. Spending Explorer
  const explorerEarned = totalTxns >= 5;
  console.log(`Badge [Spending Explorer]: ${explorerEarned} (Count: ${totalTxns}/5)`);

  achievements.push({
    id: 'explorer',
    name: 'Spending Explorer',
    emoji: '🗺️',
    description: 'You are getting the hang of this.',
    earned: explorerEarned,
    progress: `${totalTxns}/5`
  });

  // 3. Weekend Warrior
  let weekendCount = 0;
  for (const t of transactions) {
    try {
      const d = new Date(t.date);
      const day = d.getDay();
      // 0 is Sunday, 6 is Saturday
      if (day === 0 || day === 6) {
        weekendCount++;
      }
    } catch (e) {
      // Ignore invalid dates
    }
  }
  const weekendEarned = weekendCount >= 1;
  console.log(`Badge [Weekend Warrior]: ${weekendEarned} (Weekend Txns: ${weekendCount})`);

  achievements.push({
    id: 'weekend',
    name: 'Weekend Warrior',
    emoji: '🎉',
    description: 'Living for the weekend.',
    earned: weekendEarned,
    progress: weekendEarned ? 'Unlocked' : '0/1'
  });

  // --- MEDIUM BADGES ---

  // 4. Coffee Connoisseur
  const coffeeKeywords = ['coffee', 'starbucks', 'dunkin', 'cafe', 'espresso', 'java', 'peets', 'nespresso'];
  let coffeeCount = 0;
  for (const t of transactions) {
    const desc = (t.description || '').toLowerCase();
    const merchant = (t.merchant || '').toLowerCase();
    if (coffeeKeywords.some(k => desc.includes(k) || merchant.includes(k))) {
      coffeeCount++;
    }
  }
  const coffeeEarned = coffeeCount >= 5; // Lowered from 20 to 5 for easier testing
  console.log(`Badge [Coffee Connoisseur]: ${coffeeEarned} (Coffee Txns: ${coffeeCount})`);

  achievements.push({
    id: 'coffee',
    name: 'Coffee Connoisseur',
    emoji: '☕',
    description: 'Fueling the economy, one latte at a time.',
    earned: coffeeEarned,
    progress: `${coffeeCount}/5`
  });

  // 5. Tech Titan
  const techKeywords = ['apple', 'best buy', 'amazon', 'electronics', 'software', 'adobe', 'tech', 'microsoft', 'steam', 'games'];
  let techSpent = 0;
  for (const t of transactions) {
    const desc = (t.description || '').toLowerCase();
    // Check category if available, otherwise description
    const cat = (t.category || '').toLowerCase();
    
    if (cat.includes('electronics') || cat.includes('tech') || techKeywords.some(k => desc.includes(k))) {
      techSpent += t.amount;
    }
  }
  const techEarned = techSpent >= 500; // Lowered to 500
  console.log(`Badge [Tech Titan]: ${techEarned} (Tech Spend: ${techSpent})`);

  achievements.push({
    id: 'tech',
    name: 'Tech Titan',
    emoji: '💻',
    description: 'You love your gadgets.',
    earned: techEarned,
    progress: `$${Math.floor(techSpent)}/$500`
  });

  // 6. Certified Foodie
  // Relies on data summary, not just transaction list
  const topCatName = (data.topCategories?.[0]?.name || '').toLowerCase();
  const foodieEarned = topCatName.includes('food') || topCatName.includes('dining') || topCatName.includes('restaurant') || topCatName.includes('grocer') || topCatName.includes('drink');
  console.log(`Badge [Certified Foodie]: ${foodieEarned} (Top Cat: ${topCatName})`);

  achievements.push({
    id: 'foodie',
    name: 'Certified Foodie',
    emoji: '🍔',
    description: 'Food is your love language.',
    earned: foodieEarned,
    progress: foodieEarned ? 'Unlocked' : 'Not top category'
  });

  // 7. Smart Saver
  const avgTxn = data.averageTransaction || 0;
  const saverEarned = avgTxn < 50 && totalTxns > 5;
  console.log(`Badge [Smart Saver]: ${saverEarned} (Avg: ${avgTxn})`);

  achievements.push({
    id: 'saver',
    name: 'Smart Saver',
    emoji: '💚',
    description: 'Keeping those transaction averages low.',
    earned: saverEarned,
    progress: `Avg: $${Math.floor(avgTxn)}`
  });

  // 8. Frequent Flyer
  const travelKeywords = ['airline', 'delta', 'united', 'american air', 'uber', 'lyft', 'hotel', 'airbnb', 'flight', 'expedia', 'booking'];
  let travelCount = 0;
  for (const t of transactions) {
    const desc = (t.description || '').toLowerCase();
    if (travelKeywords.some(k => desc.includes(k))) {
      travelCount++;
    }
  }
  const flyerEarned = travelCount >= 3; // Lowered to 3
  console.log(`Badge [Frequent Flyer]: ${flyerEarned} (Travel Txns: ${travelCount})`);

  achievements.push({
    id: 'flyer',
    name: 'Frequent Flyer',
    emoji: '✈️',
    description: 'Catching flights, not feelings.',
    earned: flyerEarned,
    progress: `${travelCount}/3`
  });

  // 9. Home Improver
  const homeKeywords = ['home depot', 'lowes', 'ikea', 'furniture', 'hardware', 'container store'];
  let homeSpent = 0;
  for (const t of transactions) {
    const desc = (t.description || '').toLowerCase();
    if (homeKeywords.some(k => desc.includes(k))) {
      homeSpent += t.amount;
    }
  }
  const homeEarned = homeSpent >= 200; // Lowered
  achievements.push({
    id: 'home',
    name: 'Home Improver',
    emoji: '🔨',
    description: 'Building your dream home.',
    earned: homeEarned,
    progress: `$${Math.floor(homeSpent)}/$200`
  });

  // 10. Fashionista
  const fashionKeywords = ['clothing', 'zara', 'h&m', 'uniqlo', 'nike', 'adidas', 'apparel', 'shop', 'nordstrom', 'bloomingdales'];
  let fashionSpent = 0;
  for (const t of transactions) {
    const desc = (t.description || '').toLowerCase();
    if (fashionKeywords.some(k => desc.includes(k))) {
      fashionSpent += t.amount;
    }
  }
  const fashionEarned = fashionSpent >= 300; // Lowered
  achievements.push({
    id: 'fashion',
    name: 'Fashionista',
    emoji: '👗',
    description: 'Dressed to impress.',
    earned: fashionEarned,
    progress: `$${Math.floor(fashionSpent)}/$300`
  });

  // 11. Fitness Fan
  const fitnessKeywords = ['gym', 'fitness', 'planet fitness', 'equinox', 'yoga', 'cycling', 'peloton', 'health', 'soulcycle'];
  let fitnessCount = 0;
  for (const t of transactions) {
    const desc = (t.description || '').toLowerCase();
    if (fitnessKeywords.some(k => desc.includes(k))) {
      fitnessCount++;
    }
  }
  const fitnessEarned = fitnessCount >= 1;
  achievements.push({
    id: 'fitness',
    name: 'Fitness Fan',
    emoji: '💪',
    description: 'Gains for days.',
    earned: fitnessEarned,
    progress: fitnessCount > 0 ? 'Unlocked' : '0/1'
  });

  // 12. Big Spender
  let maxAmount = 0;
  for (const t of transactions) {
    if (t.amount > maxAmount) {
      maxAmount = t.amount;
    }
  }
  const bigSpenderEarned = maxAmount >= 1000; // Lowered from 2000
  achievements.push({
    id: 'big-spender',
    name: 'Big Spender',
    emoji: '💎',
    description: 'You made a single purchase over $1000.',
    earned: bigSpenderEarned,
    progress: `$${Math.floor(maxAmount)}/$1000`
  });

  // --- FINAL FALLBACK ---
  // If we have transactions but strangely no badges, force First Step
  const anyEarned = achievements.some(a => a.earned);
  if (!anyEarned && totalTxns > 0) {
      console.log("WARN: No badges earned despite transactions. Forcing First Step.");
      const firstStep = achievements.find(a => a.id === 'first-step');
      if (firstStep) {
          firstStep.earned = true;
          firstStep.progress = 'Unlocked (Fallback)';
      }
  }

  // Sort: Earned first, then by name
  return achievements.sort((a, b) => {
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    return 0;
  });
};
