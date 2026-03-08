import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

export function useDashboardMetrics(dateRange: { start: Date, end: Date }) {
  return useLiveQuery(async () => {
    const sales = await db.sales
      .where('createdAt')
      .between(dateRange.start, dateRange.end)
      .toArray();

    let grossSales = 0;
    let canceledSales = 0;
    let discountTotal = 0;
    let netSales = 0;
    let totalCost = 0;
    let transactionCount = 0;

    const salesByDate: Record<string, number> = {};
    const salesByPaymentType: Record<string, number> = {};

    // Initialize salesByDate for the chart
    const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
    days.forEach(day => {
      salesByDate[format(day, 'yyyy-MM-dd')] = 0;
    });

    sales.forEach(sale => {
      // Gross Sales (Subtotal)
      grossSales += sale.subTotal;

      if (sale.canceled) {
        canceledSales += sale.grandTotal; // Or subTotal? Assuming grandTotal is the value lost
      } else {
        // Active Sales
        transactionCount++;
        netSales += sale.grandTotal;
        
        // Cost
        if (sale.items) {
            sale.items.forEach(item => {
                totalCost += (item.cumulativeUnitCost || 0); // Assuming cumulativeUnitCost is populated
                // If not, we might need to look up product cost, but let's assume it's in the item for now as per schema
            });
        }

        // Chart Data
        const dateKey = format(sale.createdAt, 'yyyy-MM-dd');
        if (salesByDate[dateKey] !== undefined) {
          salesByDate[dateKey] += sale.grandTotal;
        }

        // Payment Type
        const paymentType = sale.paymentType;
        salesByPaymentType[paymentType] = (salesByPaymentType[paymentType] || 0) + sale.grandTotal;
      }

      // Discount
      if (sale.discount) {
          if (sale.discount.type === 'AMOUNT') {
              discountTotal += sale.discount.value;
          } else {
              // Percentage
              const discountAmount = sale.subTotal - sale.grandTotal;
              discountTotal += discountAmount;
          }
      } else {
          // Check if grandTotal < subTotal (implicit discount)
           if (sale.grandTotal < sale.subTotal) {
               discountTotal += (sale.subTotal - sale.grandTotal);
           }
      }
    });

    const grossProfit = netSales - totalCost;
    const totalDays = days.length;

    return {
      grossSales,
      canceledSales,
      discountTotal,
      netSales,
      totalCost,
      grossProfit,
      transactionCount,
      chartData: Object.entries(salesByDate).map(([date, value]) => ({ date, value })),
      paymentMethods: Object.entries(salesByPaymentType).map(([type, value]) => ({ type, value })),
      totalDays
    };
  }, [dateRange]);
}
