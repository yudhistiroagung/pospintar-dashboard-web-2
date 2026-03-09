import { useShopData } from "@/hooks/useShopData"
import { useLocation } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function Header() {
  const data = useShopData();
  const shopName = data?.shop?.name;
  const location = useLocation();

  const getTitle = () => {
      if (location.pathname === '/') return 'Laporan';
      if (location.pathname === '/transactions') return 'Penjualan';
      return 'PosPintar';
  }

  return (
    <header className="min-h-16 py-4 border-b border-gray-200 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="md:hidden text-gray-500">
          <Menu className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
      </div>
      <div className="flex items-center space-x-6">
        {/* User Profile */}
        {shopName ? (
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-100">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{shopName}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Pemilik</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {shopName.charAt(0).toUpperCase()}
            </div>
            </div>
        ) : (
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-100 opacity-50">
             <div className="text-right hidden sm:block">
                 <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                 <div className="h-3 w-12 bg-gray-200 rounded animate-pulse ml-auto"></div>
             </div>
             <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
        )}
      </div>
    </header>
  )
}
