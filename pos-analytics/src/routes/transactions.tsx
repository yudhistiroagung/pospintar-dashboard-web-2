import { createFileRoute } from '@tanstack/react-router'
import { TransactionList } from '@/components/transactions/TransactionList'

export const Route = createFileRoute('/transactions')({
  component: Transactions,
})

function Transactions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
      </div>
      
      <TransactionList />
    </div>
  )
}
