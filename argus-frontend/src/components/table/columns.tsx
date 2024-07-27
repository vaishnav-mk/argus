"use client";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "./data-table-column-header";

const badgeVariant = (level) => {
  const badges = {
    info: "success",
    warn: "warn",
    error: "destructive",
    info: "info",
    fatal: "default",
  }
  return badges[level.toLowerCase()] ?? "neutral";
};

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        <Badge variant={badgeVariant(row.getValue("level"))}>
          {row.getValue("level")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue("timestamp")).toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "service",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" />
    ),
    cell: ({ row }) => <div>{row.getValue("service")}</div>,
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => <div>{row.getValue("message")}</div>,
  },
  {
    accessorKey: "resourceID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resource ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("resourceID")}</div>,
  },
  {
    accessorKey: "traceID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trace ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("traceID")}</div>,
  },
  {
    accessorKey: "spanID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Span ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("spanID")}</div>,
  },
  {
    accessorKey: "commit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commit" />
    ),
    cell: ({ row }) => <div>{row.getValue("commit")}</div>,
  },
  // {
  //   accessorKey: "metadata.parentResourceId",
  //   header: "Parent Resource ID",
  //   cell: ({ row }) => <div>{row.getValue("metadata")}</div>,
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const log = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(log.traceID)}
            >
              Copy Trace ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
