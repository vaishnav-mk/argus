"use client";
import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ChartSection } from "@/components/ChartSection";
import { TableSection } from "@/components/table/table-card";
import { FilterComponent } from "@/components/FilterComponent";
import { MetricsSection } from "@/components/MetricsSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";

import { getAllLogs } from "@/redux/slice/dataSlice";

export default function Component() {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("graph");

  const { isError, errorMessage, logs, nextPageState, isLoading } = useSelector(
    (state) => state.data
  );

  const logData = useCallback(() => {
    dispatch(getAllLogs());
  }, [dispatch]);

  useEffect(() => {
    logData();
  }, [logData]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <>
      <Header />

      <div className="flex flex-col p-6 gap-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="graph">Graphs</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="graph">
            <ChartSection />
          </TabsContent>
          <TabsContent value="metrics">
            <MetricsSection />
          </TabsContent>
        </Tabs>

        <div className="flex flex-row gap-6">
          <FilterComponent />
          <TableSection />
        </div>
      </div>
    </>
  );
}
