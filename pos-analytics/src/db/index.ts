import Dexie, { Table } from 'dexie';
import { Shop, Sale, Product, Expense, Category, Discount } from '../lib/schemas';

export class PosDatabase extends Dexie {
  shops!: Table<Shop>;
  sales!: Table<Sale>;
  products!: Table<Product>;
  expenses!: Table<Expense>;
  categories!: Table<Category>;
  discounts!: Table<Discount>;

  constructor() {
    super('PosAnalyticsDB');
    
    // Define schema versions
    this.version(1).stores({
      shops: 'id, userId',
      sales: 'id, shopId, transactionId, paymentType, createdAt', // Indexed fields
      products: 'id, shopId, category.id, name',
      expenses: 'id, shopId, category.name, status, createdAt',
      categories: 'id, shopId',
      discounts: 'id, shopId'
    });
  }
}

export const db = new PosDatabase();
