import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useShopData() {
  return useLiveQuery(async () => {
    // Assuming there is only one shop or we want the first one
    // In a multi-tenant or multi-shop setup, we would filter by ID or 'isDefault'
    const shop = await db.shops.toCollection().first();
    const count = await db.shops.count();
    return { shop, count };
  });
}
