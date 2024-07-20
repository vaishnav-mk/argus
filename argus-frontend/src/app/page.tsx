// components/Component.tsx
"use client";
import { Header } from "@/components/Header";
import { ChartSection } from "@/components/ChartSection";
import { TableSection } from "@/components/TableSection";

export default function Component() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <ChartSection />
      <TableSection />
    </div>
  );
}
