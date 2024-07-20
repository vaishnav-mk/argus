// TableSection.tsx
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
import { CircleIcon, RefreshCwIcon } from "@/components/icons/icons";
import { PaginationComponent } from "@/components/PaginationComponent";

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

export function TableSection() {
  const [data, setData] = useState<any[]>([]);
  const [nextPageState, setNextPageState] = useState<string | null>(null);
  const [currentPageState, setCurrentPageState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback((pageState: string | null = null) => {
    setLoading(true);
    const url = pageState
      ? `/api/data?page_state=${pageState}`
      : "/api/data";

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        mode: "no-cors",
      },
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
          <CardTitle>Log Search Results</CardTitle>
          <CardDescription>
            View the search results for your log data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
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
                  <TableCell>
                    <Badge variant={badge(row.level)}>{row.level}</Badge>
                  </TableCell>
                  <TableCell>{row.message}</TableCell>
                  <TableCell>{row.resourceID}</TableCell>
                  <TableCell>{row.traceID}</TableCell>
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
            <Button variant="ghost" size="icon" onClick={() => fetchData(currentPageState)}>
              <RefreshCwIcon className="h-5 w-5" />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
