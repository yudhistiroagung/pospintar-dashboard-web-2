import { createFileRoute } from '@tanstack/react-router'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { PaymentMethods } from '@/components/dashboard/PaymentMethods'
import { Bell, ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShopData } from '@/hooks/useShopData'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const shop = useShopData();
  const shopName = shop?.name || 'Toko Sembako';
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top Header */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden text-gray-500">
            <Menu className="w-6 h-6" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-800">Laporan</h2>
        </div>
        <div className="flex items-center space-x-6">
          {/* Notification */}
          <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          {/* User Profile */}
          <div className="flex items-center space-x-3 border-l pl-6 border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{shopName}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Pemilik</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {shopName ? shopName.charAt(0).toUpperCase() : 'T'}
            </div>
          </div>
        </div>
      </header>

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
