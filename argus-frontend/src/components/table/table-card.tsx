"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLogs } from "@/redux/slice/dataSlice";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// import { ExportDropdown } from "./export-dropdown";
export function TableSection() {
  const {
    isError,
    errorMessage: errors,
    logs: data,
    nextPageState: pageState,
    isLoading: loading,
  } = useSelector((state) => state.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllLogs());
  }, [dispatch]);

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
            {/* <ExportDropdown data={data} /> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} isLoading={loading} />
        {/* <DataTablePagination
        pageState={pageState}
        loading={loading}
        error={errors}
      /> */}
      </CardContent>
    </Card>
  );
}
