import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

interface UseTransactionsProps {
    limit?: number;
    offset?: number;
    dateRange?: { start: Date; end: Date };
}

export function useTransactions({ limit = 50, offset = 0, dateRange }: UseTransactionsProps = {}) {
  return useLiveQuery(async () => {
    let collection;

    if (dateRange) {
        // When using 'between', we are querying an index. 'reverse()' on a Collection from 'between' works.
        collection = db.sales.where('createdAt').between(dateRange.start, dateRange.end).reverse();
    } else {
        collection = db.sales.orderBy('createdAt').reverse();
    }

    const transactions = await collection
      .offset(offset)
      .limit(limit)
      .toArray();
      
    // Count total based on filter
    let count = 0;
    if (dateRange) {
        count = await db.sales.where('createdAt').between(dateRange.start, dateRange.end).count();
    } else {
        count = await db.sales.count();
    }
    
    return {
      transactions,
      count
    };
  }, [limit, offset, dateRange]);
}
