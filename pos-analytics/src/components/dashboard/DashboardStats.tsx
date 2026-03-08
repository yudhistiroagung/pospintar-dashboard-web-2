import { Card, CardContent } from '@/components/ui/card';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';

export function DashboardStats() {
  const dateRange = useMemo(() => ({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  }), []);

  const metrics = useDashboardMetrics(dateRange);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  if (!metrics) {
    return <div className="p-8 text-center">Loading metrics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {/* Main KPI Card */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white border border-gray-200 p-8 rounded-2xl shadow-sm text-center">
        <div className="flex items-center justify-center text-gray-500 mb-2">
          <span className="uppercase text-sm font-bold tracking-widest mr-2">Total Penjualan</span>
          <TrendingUp className="w-4 h-4" />
        </div>
        <div className="text-4xl md:text-5xl font-extrabold text-gray-900">
          {formatCurrency(metrics.grossSales)}
        </div>
      </div>

      {/* Secondary Cards */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500 font-medium mb-1">Penjualan Dibatalkan</p>
        <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.canceledSales)}</p>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500 font-medium mb-1">Diskon</p>
        <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.discountTotal)}</p>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm border-l-4 border-l-green-500">
        <p className="text-sm text-gray-500 font-medium mb-1">Penjualan Bersih</p>
        <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.netSales)}</p>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500 font-medium mb-1">Total Harga Modal</p>
        <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.totalCost)}</p>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500 font-medium mb-1">Laba Kotor</p>
        <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.grossProfit)}</p>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm border-l-4 border-l-blue-500">
        <p className="text-sm text-gray-500 font-medium mb-1">Jumlah Penjualan</p>
        <p className="text-xl font-bold text-gray-900">{metrics.transactionCount}</p>
      </div>
    </div>
  );
}
