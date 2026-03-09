import { useShopData } from "@/hooks/useShopData"
import { useLocation } from "@tanstack/react-router"

export function Header() {
  const shop = useShopData();
  const shopName = shop?.name || 'Toko';
  const location = useLocation();

  const getTitle = () => {
      if (location.pathname === '/') return 'Laporan';
      if (location.pathname === '/transactions') return 'Penjualan';
      return 'PosPintar';
  }

  return (
    <header className="min-h-18 py-4 border-b border-gray-200 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
      </div>
      <div className="flex items-center space-x-6">
        {/* User Profile */}
        <div className="flex items-center space-x-3 border-l pl-6 border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{shopName}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Pemilik</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            {shopName ? shopName.charAt(0).toUpperCase() : 'T'}
          </div>
        </div>
      </div>
    </header>
  )
}
