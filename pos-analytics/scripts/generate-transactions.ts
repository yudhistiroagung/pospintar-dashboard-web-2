import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Sale,
  SaleItem,
  SalePaymentType,
  Product,
  BackupData,
  Shop,
  Category,
  Discount
} from '../src/lib/schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to get random integer between min and max (inclusive)
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to get random array element
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate random ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Mock Data
const SHOP_ID = 'shop_default_001';
const USER_ID = 'user_default_001';

const SHOP: Shop = {
  id: SHOP_ID,
  userId: USER_ID,
  createdAt: new Date('2025-01-01T00:00:00Z'),
  name: 'Tech Haven',
  isDefault: true,
  isActive: true,
  businessType: 'Retail',
  address: '123 Tech Street, Silicon Valley',
  phone: '+1-555-0199'
};

const CATEGORIES: Category[] = [
  {
    id: 'cat_001',
    shopId: SHOP_ID,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    name: 'Electronics',
    isDefault: false,
    description: 'Electronic gadgets and devices'
  },
  {
    id: 'cat_002',
    shopId: SHOP_ID,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    name: 'Accessories',
    isDefault: false,
    description: 'Computer and mobile accessories'
  },
  {
    id: 'cat_003',
    shopId: SHOP_ID,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    name: 'Office Supplies',
    isDefault: false,
    description: 'General office stationery'
  }
];

const PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    shopId: SHOP_ID,
    category: { id: 'cat_001', name: 'Electronics' },
    name: 'Wireless Mouse',
    price: 25.99,
    color: 'Black',
    createdAt: new Date(),
    stockTrackingEnabled: true,
  },
  {
    id: 'prod_002',
    shopId: SHOP_ID,
    category: { id: 'cat_001', name: 'Electronics' },
    name: 'Mechanical Keyboard',
    price: 89.99,
    color: 'White',
    createdAt: new Date(),
    stockTrackingEnabled: true,
  },
  {
    id: 'prod_003',
    shopId: SHOP_ID,
    category: { id: 'cat_002', name: 'Accessories' },
    name: 'USB-C Hub',
    price: 45.50,
    color: 'Silver',
    createdAt: new Date(),
    stockTrackingEnabled: true,
  },
  {
    id: 'prod_004',
    shopId: SHOP_ID,
    category: { id: 'cat_003', name: 'Office Supplies' },
    name: 'Notebook',
    price: 5.00,
    color: 'Blue',
    createdAt: new Date(),
    stockTrackingEnabled: true,
  },
  {
    id: 'prod_005',
    shopId: SHOP_ID,
    category: { id: 'cat_003', name: 'Office Supplies' },
    name: 'Pen Set',
    price: 12.99,
    color: 'Black',
    createdAt: new Date(),
    stockTrackingEnabled: true,
  }
];

const PAYMENT_TYPES: SalePaymentType[] = ['CASH', 'CARD', 'QRIS'];

function generateBackupData(): BackupData {
  const transactions: Sale[] = [];
  const today = new Date();

  // Last 40 days
  for (let i = 0; i < 40; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // 5-10 transactions per day
    const numTransactions = getRandomInt(5, 10);
    
    for (let j = 0; j < numTransactions; j++) {
      // Random time within the day (9 AM to 9 PM)
      const transactionDate = new Date(date);
      transactionDate.setHours(getRandomInt(9, 21), getRandomInt(0, 59), getRandomInt(0, 59));
      
      const numItems = getRandomInt(1, 5);
      const items: SaleItem[] = [];
      let subTotal = 0;

      for (let k = 0; k < numItems; k++) {
        const product = getRandomElement(PRODUCTS);
        const quantity = getRandomInt(1, 3);
        const itemTotal = product.price * quantity;
        
        items.push({
          productId: product.id,
          category: product.category,
          name: product.name,
          price: product.price,
          color: product.color,
          quantity: quantity,
          cumulativePrice: itemTotal,
        });
        
        subTotal += itemTotal;
      }

      // Random discount (30% chance)
      let discount = null;
      let grandTotal = subTotal;
      
      if (Math.random() < 0.3) {
        const isPercentage = Math.random() > 0.5;
        if (isPercentage) {
          const value = getRandomInt(5, 20); // 5-20%
          const amount = (subTotal * value) / 100;
          discount = {
            id: generateId(),
            name: `Promo ${value}%`,
            type: 'PERCENTAGE' as const,
            value: value
          };
          grandTotal = subTotal - amount;
        } else {
          const value = getRandomInt(1, 10); // $1-$10
          discount = {
            id: generateId(),
            name: `Voucher $${value}`,
            type: 'AMOUNT' as const,
            value: value
          };
          grandTotal = Math.max(0, subTotal - value);
        }
      }

      const transaction: Sale = {
        id: generateId(),
        transactionId: `TRX-${Date.now()}-${getRandomInt(1000, 9999)}`,
        paymentType: getRandomElement(PAYMENT_TYPES),
        shopId: SHOP_ID,
        createdAt: transactionDate,
        items: items,
        subTotal: Number(subTotal.toFixed(2)),
        grandTotal: Number(grandTotal.toFixed(2)),
        discount: discount,
        paymentAmount: Number(grandTotal.toFixed(2)), // Assuming full payment
      };
      
      transactions.push(transaction);
    }
  }

  // Sort by date (oldest first)
  transactions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const backupData: BackupData = {
    metadata: {
      userId: USER_ID,
      shopId: SHOP_ID,
      createdAt: new Date().toISOString(),
      version: 1,
      type: 'FULL_BACKUP'
    },
    data: {
      shop: SHOP,
      sales: transactions,
      products: PRODUCTS,
      categories: CATEGORIES,
      expenses: [],
      discounts: []
    }
  };

  return backupData;
}

const data = generateBackupData();
const outputPath = path.join(__dirname, '../../transactions.json');

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Generated ${data.data.sales?.length ?? 0} transactions in ${outputPath}`);
