import { createFileRoute } from '@tanstack/react-router'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { PaymentMethods } from '@/components/dashboard/PaymentMethods'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="Laporan" />

      {/* Main Content Area */}
      <div className="p-8 overflow-y-auto max-w-7xl mx-auto w-full flex-1">
        {/* Date Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <button className="px-4 py-2 hover:bg-gray-100 transition-colors border-r border-gray-200">
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div className="px-8 py-2 font-semibold text-gray-700">Bulan Ini</div>
            <button className="px-4 py-2 hover:bg-gray-100 transition-colors border-l border-gray-200">
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Summary Cards Grid */}
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Chart Section */}
          <div className="lg:col-span-2 h-96">
             <SalesChart />
          </div>
          {/* Payment Types */}
          <div className="h-96">
             <PaymentMethods />
          </div>
        </div>
      </div>
    </div>
  )
}
