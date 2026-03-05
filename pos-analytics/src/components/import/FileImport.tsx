import { useState } from 'react';
import { processBackupFile } from '../../features/import/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function FileImport() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const result = await processBackupFile(file);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Import Successful",
        description: `Imported ${result.count} sales records.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "Invalid file format or schema mismatch.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Import Backup Data</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input 
            type="file" 
            accept=".json" 
            onChange={handleFileChange} 
            disabled={loading}
          />
        </div>
        {loading && <p className="text-sm text-muted-foreground">Processing...</p>}
      </CardContent>
    </Card>
  );
}
