import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface TransactionListProps {
    dateRange?: { start: Date; end: Date };
}

export function TransactionList({ dateRange }: TransactionListProps) {
  const { transactions, count } = useTransactions({ limit: 50, dateRange }) || { transactions: [], count: 0 };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{format(sale.createdAt, 'MMM dd, yyyy HH:mm')}</TableCell>
              <TableCell className="font-mono text-xs">{sale.transactionId}</TableCell>
              <TableCell>
                <Badge variant="outline">{sale.paymentType}</Badge>
              </TableCell>
              <TableCell>{sale.items.length} items</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(sale.grandTotal)}
              </TableCell>
            </TableRow>
          ))}
          {transactions?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="p-4 text-xs text-muted-foreground text-center">
        Showing recent {transactions?.length} of {count} transactions
      </div>
    </div>
  )
}
