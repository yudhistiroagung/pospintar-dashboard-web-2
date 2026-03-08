import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { useMemo } from 'react';
import { id } from 'date-fns/locale';

export function SalesChart() {
  const dateRange = useMemo(() => ({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  }), []);

  const metrics = useDashboardMetrics(dateRange);

  if (!metrics) {
    return <div className="h-64 flex items-center justify-center text-gray-400">Loading chart...</div>;
  }

  const data = metrics.chartData.map(item => ({
    ...item,
    displayDate: format(new Date(item.date), 'd MMM', { locale: id })
  }));

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Penjualan Bulan Ini</h3>
          <p className="text-sm text-gray-400">Tren penjualan 30 hari terakhir</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-tighter">Total</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(metrics.netSales)}</p>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 500 }}
              dy={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickFormatter={(value) => value >= 1000 ? `${value/1000}k` : value}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Penjualan']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
