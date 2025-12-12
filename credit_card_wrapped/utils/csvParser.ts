
import Papa from 'papaparse';
import { Transaction } from '../types';

export const parseCSV = async (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const transactions = normalizeData(results.data as any[], file.name);
          if (transactions.length === 0) {
            reject(new Error(`No valid transactions found in ${file.name}.`));
          } else {
            resolve(transactions);
          }
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

const normalizeData = (data: any[], fileName: string): Transaction[] => {
  const transactions: Transaction[] = [];

  // Identify column names dynamically
  if (data.length === 0) return [];
  const keys = Object.keys(data[0]).map(k => k.toLowerCase());

  const dateKey = keys.find(k => k.includes('date') || k.includes('time'));
  const descKey = keys.find(k => k.includes('description') || k.includes('merchant') || k.includes('payee') || k.includes('name') || k.includes('narrative'));
  const amountKey = keys.find(k => (k.includes('amount') || k.includes('debit') || k.includes('cost')) && !k.includes('original'));
  const categoryKey = keys.find(k => k.includes('category') || k.includes('type'));

  if (!dateKey || !amountKey) {
    throw new Error(`Could not detect Date or Amount columns in ${fileName}.`);
  }

  for (const row of data) {
    // Helper to get value ignoring case of key
    const getValue = (keyPart: string) => {
      const realKey = Object.keys(row).find(k => k.toLowerCase() === keyPart);
      return realKey ? row[realKey] : null;
    };

    const rawDate = row[Object.keys(row).find(k => k.toLowerCase() === dateKey)!];
    const rawDesc = getValue(descKey || '') || 'Unknown Merchant';
    const rawAmount = row[Object.keys(row).find(k => k.toLowerCase() === amountKey)!];
    const rawCategory = categoryKey ? getValue(categoryKey) : undefined;

    if (!rawDate || !rawAmount) continue;

    // Parse Amount
    let amount = parseFloat(String(rawAmount).replace(/[^0-9.-]/g, ''));
    if (isNaN(amount)) continue;

    if (rawDesc.toLowerCase().includes('payment') || rawDesc.toLowerCase().includes('thank you')) {
        continue;
    }
    amount = Math.abs(amount);

    // Parse Date
    const date = new Date(rawDate).toISOString(); 

    transactions.push({
      date,
      description: rawDesc,
      merchant: cleanMerchantName(rawDesc),
      amount,
      category: rawCategory,
      source: fileName
    });
  }

  return transactions;
};

const cleanMerchantName = (description: string): string => {
  let name = description.trim();
  name = name.replace(/(PURCHASE AUTHORIZED ON \d{2}\/\d{2})|(\d{10,})|(DEBIT CARD \d+)/gi, '');
  name = name.replace(/\d{2}\/\d{2}/g, '');
  name = name.replace(/\s{2,}/g, ' ');
  return name.trim().split('*')[0].trim(); 
};
