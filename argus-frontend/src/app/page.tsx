// components/Component.tsx
"use client";
import { Header } from "@/components/Header";
import { ChartSection } from "@/components/ChartSection";
import { TableSection } from "@/components/TableSection";
import { FilterComponent } from "@/components/FilterComponent";
import { MetricsSection } from "@/components/MetricsSection";
import { useCounterStore } from "@/providers/counter-store-provider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";

export default function Component() {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state
  );
  const [activeTab, setActiveTab] = React.useState("graph");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <>
      <Header />

      <div className="flex flex-col h-screen p-6 gap-6">
        {/* <div>
        Count: {count}
        <hr />
        <button type="button" onClick={() => void incrementCount()}>
          Increment Count
        </button>
        <button type="button" onClick={() => void decrementCount()}>
          Decrement Count
        </button>
      </div> */}
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
