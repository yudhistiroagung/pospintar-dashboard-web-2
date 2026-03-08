import { createFileRoute } from '@tanstack/react-router'
import { TransactionList } from '@/components/transactions/TransactionList'
import { Header } from '@/components/layout/Header'

export const Route = createFileRoute('/transactions')({
  component: Transactions,
})

function Transactions() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="Penjualan" />
      
      <div className="p-8 overflow-y-auto max-w-7xl mx-auto w-full flex-1">
        <TransactionList />
      </div>
    </div>
  )
}
