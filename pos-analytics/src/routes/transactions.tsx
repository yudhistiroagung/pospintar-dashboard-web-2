import { createFileRoute } from '@tanstack/react-router'
import { TransactionList } from '@/components/transactions/TransactionList'
import { DateRangePicker } from '@/components/common/DateRangePicker'
import { useState } from 'react'
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { useShopData } from '@/hooks/useShopData'
import { EmptyState } from '@/components/common/EmptyState'

export const Route = createFileRoute('/transactions')({
  component: Transactions,
})

function Transactions() {
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
      
      <div className="p-8 overflow-y-auto max-w-7xl mx-auto w-full flex-1">
        <div className="flex items-center justify-end mb-8 gap-4">
           <DateRangePicker date={date} setDate={setDate} className="w-[300px]" />
        </div>

        <TransactionList dateRange={queryDateRange} />
      </div>
    </div>
  )
}
