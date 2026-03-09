import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { db } from '@/db';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function SidebarReset() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReset = async () => {
    setLoading(true);
    try {
      await db.transaction('rw', [db.shops, db.sales, db.products, db.expenses, db.categories, db.discounts], async () => {
        await db.shops.clear();
        await db.sales.clear();
        await db.products.clear();
        await db.expenses.clear();
        await db.categories.clear();
        await db.discounts.clear();
      });

      toast({
        title: "Reset Berhasil",
        description: "Semua data telah dihapus dari database.",
      });
      
      // Optional: Refresh page to clear states
      window.location.reload();

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reset Gagal",
        description: "Gagal menghapus data.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={loading}
          className="flex w-full items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5 mr-3" />
          <span className="font-medium">
              {loading ? 'Memproses...' : 'Reset Data'}
          </span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus semua data transaksi, produk, dan pengaturan toko Anda secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
            Ya, Hapus Semua
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
