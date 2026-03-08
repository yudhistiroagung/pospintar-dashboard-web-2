import { createFileRoute } from '@tanstack/react-router'
import { TransactionList } from '@/components/transactions/TransactionList'

export const Route = createFileRoute('/transactions')({
  component: Transactions,
})

function Transactions() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      
      <div className="p-8 overflow-y-auto max-w-7xl mx-auto w-full flex-1">
        <TransactionList />
      </div>
    </div>
  )
}
