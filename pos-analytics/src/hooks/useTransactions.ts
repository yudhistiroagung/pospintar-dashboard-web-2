import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useTransactions(limit = 50, offset = 0) {
  return useLiveQuery(async () => {
    const transactions = await db.sales
      .orderBy('createdAt')
      .reverse()
      .offset(offset)
      .limit(limit)
      .toArray();
      
    const count = await db.sales.count();
    
    return {
      transactions,
      count
    };
  }, [limit, offset]);
}
