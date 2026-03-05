import { createFileRoute } from '@tanstack/react-router'
import { FileImport } from '@/components/import/FileImport'
import { DashboardStats } from '@/components/dashboard/DashboardStats'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      
      <FileImport />
      
      <DashboardStats />
    </div>
  )
}
