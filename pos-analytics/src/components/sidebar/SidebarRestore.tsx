import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { processBackupFile } from '@/features/import/utils';
import { useToast } from '@/hooks/use-toast';
import { useShopData } from '@/hooks/useShopData';
import { cn } from '@/lib/utils';

export function SidebarRestore() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { count } = useShopData() || { count: 0 };
  const isEmpty = count === 0;

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
        // We need to cast result as the return type isn't explicitly exported but inferred
        const result = await processBackupFile(file) as { success: boolean, count?: number, error?: any };
        
        if (result.success) {
          toast({
            title: "Restore Berhasil",
            description: `Berhasil memulihkan ${result.count} data transaksi.`,
          });
        } else {
             throw new Error("Format data tidak valid");
        }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Restore Gagal",
        description: "Gagal memproses file backup. Pastikan format file benar.",
      });
      console.error(error);
    } finally {
      setLoading(false);
      // Reset input
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
      />
      <button
        onClick={handleClick}
        disabled={loading}
        className={cn(
          "relative flex w-full items-center px-4 py-3 text-gray-600 rounded-lg transition-all group disabled:opacity-50 overflow-hidden",
          isEmpty ? "bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700" : "hover:bg-gray-50 bg-white"
        )}
      >
        {isEmpty && !loading && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="absolute inline-flex h-full w-full rounded-lg bg-blue-400 opacity-10 animate-ping duration-1000"></span>
          </span>
        )}
        <Upload className={cn("w-5 h-5 mr-3 relative z-10", isEmpty ? "text-blue-600" : "text-gray-500")} />
        <span className="font-medium relative z-10">
            {loading ? 'Memproses...' : 'Restore Data'}
        </span>
      </button>
    </>
  );
}
