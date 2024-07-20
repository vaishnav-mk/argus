// components/Header.tsx
"use client";
import React from "react";
import { addDays, format } from "date-fns";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarClockIcon,
  ChevronRightIcon,
  FilterIcon,
  ListOrderedIcon,
  Package2Icon,
  SearchIcon,
} from "@/components/icons/icons";

export function Header() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: addDays(new Date(Date.now()), 3),
  });
  return (
    <header className="bg-background border-b px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <Package2Icon className="h-6 w-6" />
            <span className="font-semibold">Log Management</span>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="w-full rounded-md bg-muted pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <FilterIcon className="h-5 w-5" />
                <span className="sr-only">Filters</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="px-4 py-2 font-medium">
                Filters
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>
                <div className="flex items-center justify-between">
                  <span>Log Level</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </div>
              </DropdownMenuCheckboxItem>
              {/* Other DropdownMenuCheckboxItem components */}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <CalendarClockIcon className="h-5 w-5" />
                <span className="sr-only">Date Range</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="px-4 py-2 font-medium">
                Date Range
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
              <div className="flex justify-end">
                <Button variant="primary">Apply</Button>
                <Button variant="outline" className="ml-2">
                  Cancel
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
