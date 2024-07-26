import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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

const filterOptions = [
  {
    key: "level",
    label: "Level",
    options: ["debug", "info", "warn", "error", "fatal"],
  },
  { key: "message", label: "Message" },
  { key: "resourceId", label: "Resource ID" },
  { key: "traceId", label: "Trace ID" },
  { key: "spanId", label: "Span ID" },
  { key: "commit", label: "Commit" },
  { key: "metadata.parentResourceId", label: "Parent Resource ID" },
  { key: "regex", label: "Regular Expression" },
];

export function FilterComponent() {
  const [filters, setFilters] = useState(
    filterOptions.reduce((acc, { key }) => ({ ...acc, [key]: "" }), {
      level: ["debug", "info", "warn", "error", "fatal"],
    })
  );
  const [useRegex, setUseRegex] = useState(false);

  const handleFilter = (key: string, value: string | string[]) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const handleRegexToggle = (checked: boolean) => {
    setUseRegex(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>
          Filter logs based on the following criteria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {filterOptions.map(({ key, label, options }) => (
          <div key={key}>
            {options ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>{label}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {options.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option}
                      checked={filters[key].includes(option)}
                      onCheckedChange={(checked) =>
                        handleFilter(
                          key,
                          checked
                            ? [...filters[key], option]
                            : filters[key].filter((l) => l !== option)
                        )
                      }
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Input
                placeholder={label}
                value={filters[key]}
                onChange={(e) => handleFilter(key, e.target.value)}
              />
            )}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="w-full">
            Apply Filters
          </Button>
          <Button
            variant="primary"
            className="w-full"
            onClick={() =>
              setFilters(
                filterOptions.reduce(
                  (acc, { key }) => ({ ...acc, [key]: "" }),
                  { level: ["debug", "info", "warn", "error", "fatal"] }
                )
              )
            }
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
