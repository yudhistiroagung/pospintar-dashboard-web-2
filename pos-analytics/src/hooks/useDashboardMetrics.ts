import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useDashboardMetrics(dateRange: { start: Date, end: Date }) {
  return useLiveQuery(async () => {
    // 1. Revenue
    const sales = await db.sales
      .where('createdAt')
      .between(dateRange.start, dateRange.end)
      .toArray();
      
    const revenue = sales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0);
    const transactionCount = sales.length;

    // 2. Expenses
    const expenses = await db.expenses
      .where('createdAt')
      .between(dateRange.start, dateRange.end)
      .toArray();
      
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.value || 0), 0);

    // 3. Profit
    const netProfit = revenue - totalExpenses;

    return {
      revenue,
      expenses: totalExpenses,
      netProfit,
      transactionCount,
      recentSales: sales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5) // Sort by date desc
    };
  }, [dateRange]);
}
