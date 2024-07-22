import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function FilterComponent() {
  const [filters, setFilters] = useState({
    level: ["debug", "info", "warn", "error", "fatal"],
    message: "",
    resourceId: "",
    traceId: "",
    spanId: "",
    commit: "",
    "metadata.parentResourceId": "",
  });
  const [useRegex, setUseRegex] = useState(false);

  const handleFilter = (key: string, value: string | string[]) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleRegexToggle = (checked: boolean) => {
    setUseRegex(checked);
  };

  return (
    <Card className="h-">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>
          Filter logs based on the following criteria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>Level</span>
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuCheckboxItem
              checked={filters.level.includes("debug")}
              onCheckedChange={(checked) =>
                handleFilter(
                  "level",
                  checked
                    ? [...filters.level, "debug"]
                    : filters.level.filter((l) => l !== "debug")
                )
              }
            >
              Debug
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.level.includes("info")}
              onCheckedChange={(checked) =>
                handleFilter(
                  "level",
                  checked
                    ? [...filters.level, "info"]
                    : filters.level.filter((l) => l !== "info")
                )
              }
            >
              Info
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.level.includes("warn")}
              onCheckedChange={(checked) =>
                handleFilter(
                  "level",
                  checked
                    ? [...filters.level, "warn"]
                    : filters.level.filter((l) => l !== "warn")
                )
              }
            >
              Warn
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.level.includes("error")}
              onCheckedChange={(checked) =>
                handleFilter(
                  "level",
                  checked
                    ? [...filters.level, "error"]
                    : filters.level.filter((l) => l !== "error")
                )
              }
            >
              Error
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.level.includes("fatal")}
              onCheckedChange={(checked) =>
                handleFilter(
                  "level",
                  checked
                    ? [...filters.level, "fatal"]
                    : filters.level.filter((l) => l !== "fatal")
                )
              }
            >
              Fatal
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder="Message"
          value={filters.message}
          onChange={(e) => handleFilter("message", e.target.value)}
        />
        <Input
          placeholder="Resource ID"
          value={filters.resourceId}
          onChange={(e) => handleFilter("resourceId", e.target.value)}
        />
        <div />
        <Input
          placeholder="Trace ID"
          value={filters.traceId}
          onChange={(e) => handleFilter("traceId", e.target.value)}
        />
        <Input
          placeholder="Span ID"
          value={filters.spanId}
          onChange={(e) => handleFilter("spanId", e.target.value)}
        />
        <Input
          placeholder="Commit"
          value={filters.commit}
          onChange={(e) => handleFilter("commit", e.target.value)}
        />
        <Input
          placeholder="Parent Resource ID"
          value={filters["metadata.parentResourceId"]}
          onChange={(e) =>
            handleFilter("metadata.parentResourceId", e.target.value)
          }
        />
        <Input
          placeholder="Regular Expression"
          value={filters["regex"]}
          onChange={(e) => handleFilter("regex", e.target.value)}
        />
        <div />
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="w-full">
            Apply Filters
          </Button>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setFilters({})}
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
