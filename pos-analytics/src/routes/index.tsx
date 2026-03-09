import { createFileRoute } from '@tanstack/react-router'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { PaymentMethods } from '@/components/dashboard/PaymentMethods'
import { DateRangePicker } from '@/components/common/DateRangePicker'
import { useState } from 'react'
import { startOfMonth, endOfMonth, endOfDay, startOfDay } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { useShopData } from '@/hooks/useShopData'
import { EmptyState } from '@/components/common/EmptyState'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })

  const { count } = useShopData() || { count: 0 };

  // Ensure we have a valid date range for queries
  const queryDateRange = {
    start: startOfDay(date?.from ?? new Date()),
    end: endOfDay(date?.to ?? date?.from ?? new Date()),
  }

  if (count === 0) {
      return (
          <div className="flex flex-col h-full bg-gray-50">
             <div className="flex-1">
                 <EmptyState />
             </div>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      
      {/* Main Content Area */}
      <div className="p-8 overflow-y-auto max-w-7xl mx-auto w-full flex-1">
        {/* Date Selector */}
        <div className="flex items-center justify-end mb-8 gap-4">
          <DateRangePicker date={date} setDate={setDate} className="w-[300px]" />
        </div>

        {/* Summary Cards Grid */}
        <DashboardStats dateRange={queryDateRange} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Chart Section */}
          <div className="lg:col-span-2 h-96">
             <SalesChart dateRange={queryDateRange} />
          </div>
          {/* Payment Types */}
          <div className="h-96">
             <PaymentMethods dateRange={queryDateRange} />
          </div>
        </div>
      </div>
    </div>
  )
}
