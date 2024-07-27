"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";

// import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const serviceFacets = table.getColumn("service")?.getFacetedUniqueValues();
  let serviceOptions = [];

  if (serviceFacets) {
    for (const [service, count] of serviceFacets) {
      serviceOptions.push({
        label: service,
        value: service,
      });
    }
  }

  const errorFacets = table.getColumn("level")?.getFacetedUniqueValues();
  let errorOptions = [];

  if (errorFacets) {
    for (const [error, count] of errorFacets) {
      errorOptions.push({
        label: error,
        value: error,
      });
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Messages..."
          value={(table.getColumn("message")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("message")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("service") && (
          <DataTableFacetedFilter
            column={table.getColumn("service")}
            title="Service"
            options={serviceOptions}
          />
        )}
        {table.getColumn("level") && (
          <DataTableFacetedFilter
            column={table.getColumn("level")}
            title="Level"
            options={errorOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
