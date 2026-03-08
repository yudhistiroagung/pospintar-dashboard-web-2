import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { processBackupFile } from '@/features/import/utils';
import { useToast } from '@/hooks/use-toast';

export function SidebarRestore() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        className="flex w-full items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group disabled:opacity-50"
      >
        <Upload className="w-5 h-5 mr-3" />
        <span className="font-medium">
            {loading ? 'Memproses...' : 'Restore Data'}
        </span>
      </button>
    </>
  );
}
