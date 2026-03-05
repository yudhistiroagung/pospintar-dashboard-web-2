import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/toaster'
import { LayoutDashboard, ReceiptText, Upload } from 'lucide-react'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex h-screen flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-muted/40 md:flex md:flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="">POS Analytics</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-2 p-4 text-sm font-medium">
            <Link 
              to="/" 
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted [&.active]:text-primary"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              to="/transactions" 
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted [&.active]:text-primary"
            >
              <ReceiptText className="h-4 w-4" />
              Transactions
            </Link>
          </nav>
        </aside>

        {/* Mobile Nav - Placeholder */}
        <div className="md:hidden border-b p-4 flex justify-between items-center">
             <span className="font-semibold">POS Analytics</span>
             <nav className="flex gap-4 text-sm">
               <Link to="/" className="hover:text-primary">Dashboard</Link>
               <Link to="/transactions" className="hover:text-primary">Transactions</Link>
             </nav>
        </div>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
      <TanStackRouterDevtools />
    </>
  ),
})
