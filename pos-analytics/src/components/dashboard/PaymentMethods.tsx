import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { Banknote, CreditCard, QrCode } from 'lucide-react';

export function PaymentMethods() {
  const dateRange = useMemo(() => ({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  }), []);

  const metrics = useDashboardMetrics(dateRange);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  if (!metrics) {
    return <div className="p-8 text-center text-gray-400">Loading payment methods...</div>;
  }

  const paymentConfig: Record<string, { label: string, icon: any, color: string, bg: string }> = {
    CASH: { label: 'Tunai', icon: Banknote, color: 'text-green-600', bg: 'bg-green-50' },
    CARD: { label: 'Kartu', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    QRIS: { label: 'QR', icon: QrCode, color: 'text-purple-600', bg: 'bg-purple-50' },
  };

  // Sort payment methods by value desc or keep as is?
  // Let's sort by value desc
  const sortedMethods = [...metrics.paymentMethods].sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Tipe Pembayaran</h3>
      <div className="space-y-6 flex-1">
        {sortedMethods.map((method) => {
          const config = paymentConfig[method.type] || { label: method.type, icon: Banknote, color: 'text-gray-600', bg: 'bg-gray-50' };
          const Icon = config.icon;
          return (
            <div key={method.type} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center ${config.color} mr-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-gray-700">{config.label}</span>
              </div>
              <span className="font-bold text-gray-900">{formatCurrency(method.value)}</span>
            </div>
          );
        })}
        {sortedMethods.length === 0 && (
            <div className="text-center text-gray-400 py-4">Tidak ada data pembayaran</div>
        )}
      </div>
    </div>
  );
}
