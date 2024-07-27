import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

interface DataTableLoadingProps {
  columns: number;
  rows: number;
}

export function DataTableLoading<DataTableLoadingProps>({ rows, columns }) {
  return Array.from({ length: rows }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="w-24 h-4" />
        </TableCell>
      ))}
    </TableRow>
  ));
}
