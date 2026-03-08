import { Button } from "@/components/ui/button"
import { useShopData } from "@/hooks/useShopData"
import { Bell, Menu } from "lucide-react"

interface HeaderProps {
    title: string
}

export function Header({ title }: HeaderProps) {
  const shop = useShopData();
  const shopName = shop?.name || 'Toko Sembako';

  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="md:hidden text-gray-500">
          <Menu className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="flex items-center space-x-6">
        {/* Notification */}
        <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
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
