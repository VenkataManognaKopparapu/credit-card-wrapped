
import emailjs from '@emailjs/browser';
import { WrappedData } from '../types';

export const sendReport = async (email: string, data: WrappedData): Promise<boolean> => {
  console.log(`Simulating sending email to ${email}...`);
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log what would be sent
    console.log("Email Report Data:", {
        to_email: email,
        total_spending: `$${data.totalSpent.toFixed(2)}`,
        transaction_count: data.transactionCount,
        top_merchant: data.topMerchant.name,
        top_category: data.topCategories[0]?.name,
        ai_persona: data.persona.title
    });

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};

export const generateDownloadText = (data: WrappedData): string => {
  const date = new Date().toLocaleDateString();
  const badges = data.achievements?.filter(a => a.earned).map(a => `[x] ${a.emoji} ${a.name}`).join('\n') || 'No badges earned yet';

  return `
CREDIT CARD WRAPPED 2024 REPORT
Generated on: ${date}
----------------------------------------

SUMMARY
Total Spent: $${data.totalSpent.toFixed(2)}
Transactions: ${data.transactionCount}
Average Transaction: $${data.averageTransaction.toFixed(2)}
Busiest Month: ${data.busiestMonth}

YOUR PERSONA
${data.persona.emoji} ${data.persona.title}
"${data.persona.description}"

TOP SPENDING
Top Merchant: ${data.topMerchant.name} ($${data.topMerchant.amount.toFixed(2)} - ${data.topMerchant.count} visits)
Top Category: ${data.topCategories[0]?.name || 'N/A'} (${data.topCategories[0]?.percentage.toFixed(1)}%)
Biggest Purchase: ${data.mostExpensivePurchase.merchant} ($${data.mostExpensivePurchase.amount.toFixed(2)})

ACHIEVEMENTS
${badges}

----------------------------------------
Processed locally by Credit Card Wrapped
`;
};
