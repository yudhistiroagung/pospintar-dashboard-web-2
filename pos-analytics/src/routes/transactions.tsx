import { createFileRoute } from '@tanstack/react-router'
import { TransactionList } from '@/components/transactions/TransactionList'
import { DateRangePicker } from '@/components/common/DateRangePicker'
import { useState } from 'react'
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns'
import { DateRange } from 'react-day-picker'

export const Route = createFileRoute('/transactions')({
  component: Transactions,
})

function Transactions() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  })

  // Ensure we have a valid date range for queries
  const queryDateRange = {
    start: startOfDay(date?.from ?? new Date()),
    end: endOfDay(date?.to ?? date?.from ?? new Date()),
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
