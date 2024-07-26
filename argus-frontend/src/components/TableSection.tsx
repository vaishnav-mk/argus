"use client";

import * as React from "react";
import {
  CircleIcon,
  RefreshCwIcon,
  ListOrderedIcon,
  SearchIcon,
} from "@/components/icons/icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { getAllLogs } from "@/redux/slice/dataSlice";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => (
      <div>{new Date(row.getValue("timestamp")).toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "service",
    header: "Service",
    cell: ({ row }) => <div>{row.getValue("service")}</div>,
  },
  {
    accessorKey: "level",
    header: "Log Level",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("level")}</div>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => <div>{row.getValue("message")}</div>,
  },
  {
    accessorKey: "resourceID",
    header: "Resource ID",
    cell: ({ row }) => <div>{row.getValue("resourceID")}</div>,
  },
  {
    accessorKey: "traceID",
    header: "Trace ID",
    cell: ({ row }) => <div>{row.getValue("traceID")}</div>,
  },
  {
    accessorKey: "spanID",
    header: "Span ID",
    cell: ({ row }) => <div>{row.getValue("spanID")}</div>,
  },
  {
    accessorKey: "commit",
    header: "Commit",
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

const ExportDropdown = ({ data }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">Export</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Export format</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => exportData(data, "csv")}>
        CSV
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => exportData(data, "json")}>
        JSON
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const toJSON = (data) => JSON.stringify(data, null, 2);

const toCSV = (data) => {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(","));
  return [headers, ...rows].join("\n");
};

const exportData = (data, format) => {
  const fileName = `logs-${new Date().toISOString()}`;
  const dataStr = format === "csv" ? toCSV(data) : toJSON(data);
  const dataUri = `data:text/${format};charset=utf-8,${dataStr}`;

  const link = document.createElement("a");
  link.setAttribute("href", dataUri);
  link.setAttribute("download", `${fileName}.${format}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const sortData = (data, key, order = "asc") => {
  return data.sort((a, b) => {
    if (a[key] < b[key]) {
      return order === "asc" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });
};

const SortDropdown = ({ data, sortData, setSortData }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="hidden sm:flex">
        <ListOrderedIcon className="h-4 w-4 mr-2" />
        Sort
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {data?.length > 0 &&
        Object.keys(data?.at(0)).map((key) => (
          <DropdownMenuCheckboxItem
            checked={sortData.key === key}
            key={key}
            onClick={() => {
              const sortedData = sortData(data, key, sortData.direction);
              setSortData({
                key,
                direction: sortData.direction === "asc" ? "desc" : "asc",
              });
              setData([...sortedData]);
            }}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </DropdownMenuCheckboxItem>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export function TableSection() {
  const {
    isError,
    errorMessage: errors,
    logs: data,
    nextPageState: pageState,
    isLoading: loading,
  } = useSelector((state) => state.data);

  const dispatch = useDispatch();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center gap-10">
          <div>
            <CardTitle>Log Search Results</CardTitle>
            <CardDescription>
              View the search results for your log data.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {/* <SearchInput setSearch={setSearch} /> */}
            <ExportDropdown data={data} />
            <SortDropdown
              data={data}
              sortData={sortData}
              // setSortData={setSortData}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter logs..."
              value={
                (table.getColumn("message")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("message")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
