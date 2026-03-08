import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/toaster'
import { FileText, ShoppingCart } from 'lucide-react'
import { SidebarRestore } from '@/components/sidebar/SidebarRestore'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex h-screen flex-col md:flex-row bg-gray-50 text-gray-800 antialiased font-sans">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-white border-gray-200 md:flex md:flex-col sticky top-0 h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-600">PosPintar</h1>
          </div>
          <nav className="flex-1 px-4 space-y-1 mt-4">
            <Link 
              to="/" 
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:border-r-4 [&.active]:border-blue-600"
            >
              <FileText className="w-5 h-5 mr-3" />
              <span className="font-medium">Laporan</span>
            </Link>
            <Link 
              to="/transactions" 
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:border-r-4 [&.active]:border-blue-600"
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
              <span className="font-medium">Penjualan</span>
            </Link>
          </nav>
          <div className="p-4 mt-auto border-t border-gray-100">
            <SidebarRestore />
          </div>
        </aside>

        {/* Mobile Nav - Placeholder */}
        <div className="md:hidden border-b p-4 flex justify-between items-center bg-white">
             <span className="font-bold text-blue-600">PosPintar</span>
             <nav className="flex gap-4 text-sm">
               <Link to="/" className="hover:text-blue-600">Laporan</Link>
               <Link to="/transactions" className="hover:text-blue-600">Penjualan</Link>
             </nav>
        </div>

        <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
          <Outlet />
        </main>
      </div>
      <Toaster />
      <TanStackRouterDevtools />
    </>
  ),
})
