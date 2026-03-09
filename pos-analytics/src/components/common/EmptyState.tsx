import { Upload } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-gray-100 p-6 rounded-full mb-6 animate-pulse">
        <Upload className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Data</h3>
      <p className="text-gray-500 max-w-sm mb-8">
        Sepertinya Anda belum memiliki data transaksi. Silakan restore data backup Anda melalui menu di sidebar.
      </p>
    </div>
  )
}
