import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
  CircleIcon,
  RefreshCwIcon,
  ListOrderedIcon,
} from "@/components/icons/icons";
import { PaginationComponent } from "@/components/PaginationComponent";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function badge(level: string) {
  switch (level) {
    case "info":
      return "success";
    case "warn":
      return "warning";
    case "error":
      return "destructive";
    default:
      return "neutral";
  }
}

function toJSON(data: any[]) {
  return JSON.stringify(data, null, 2);
}

function toCSV(data: any[]) {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(","));
  return [headers, ...rows].join("\n");
}

function exportData(data: any[], format: string) {
  const fileName = `logs-${new Date().toISOString()}`;
  const dataStr = format === "csv" ? toCSV(data) : toJSON(data);
  const dataUri = `data:text/${format};charset=utf-8,${dataStr}`;

  const link = document.createElement("a");
  link.setAttribute("href", dataUri);
  link.setAttribute("download", `${fileName}.${format}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function sort(data: any[], key: string, order: "asc" | "desc" = "asc") {
  return data.sort((a, b) => {
    if (a[key] < b[key]) {
      return order === "asc" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });
}

export function TableSection() {
  const [data, setData] = useState<any[]>([]);
  const [nextPageState, setNextPageState] = useState<string | null>(null);
  const [currentPageState, setCurrentPageState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortData, setSortData] = useState<any>({});

  const fetchData = useCallback((pageState: string | null = null) => {
    setLoading(true);
    const url = "/api/data";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_state: pageState || "" }),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.logs);
        setNextPageState(data.nextPageState);
        setCurrentPageState(pageState);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Log Search Results</CardTitle>
              <CardDescription>
                View the search results for your log data.
              </CardDescription>
            </div>
            <div className="flex gap-2">
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

              <Button
                variant="outline"
                className="hidden sm:flex"
                onClick={() => {
                  const sortedData = sort(
                    data,
                    "timestamp",
                    sortData.direction
                  );
                  setSortData({
                    key: "timestamp",
                    direction: sortData.direction === "asc" ? "desc" : "asc",
                  });
                  setData([...sortedData]);
                }}
              >
                <ListOrderedIcon className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Log Level</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Resource ID</TableHead>
                <TableHead>Trace ID</TableHead>
                <TableHead>Span ID</TableHead>
                <TableHead>Commit</TableHead>
                <TableHead>Metadata.parentResourceId</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.timestamp}>
                  <TableCell>{row.timestamp}</TableCell>
                  <TableCell>{row.traceID}</TableCell>
                  <TableCell>
                    <Badge variant={badge(row.level)}>{row.level}</Badge>
                  </TableCell>
                  <TableCell>{row.message}</TableCell>
                  <TableCell>{row.resourceID}</TableCell>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>{row.spanID}</TableCell>
                  <TableCell>{row.commit}</TableCell>
                  <TableCell>{row.metadata.parentResourceId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <PaginationComponent
            currentPageState={currentPageState}
            nextPageState={nextPageState}
            onPageChange={(pageState) => fetchData(pageState)}
          />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              <CircleIcon className="h-3 w-3 text-green-500" />
              Connected
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchData(currentPageState)}
            >
              <RefreshCwIcon className="h-5 w-5" />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
