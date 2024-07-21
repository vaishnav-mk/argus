// components/Component.tsx
"use client";
import { Header } from "@/components/Header";
import { ChartSection } from "@/components/ChartSection";
import { TableSection } from "@/components/TableSection";
import { useCounterStore } from "@/providers/counter-store-provider";

export default function Component() {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state
  );
  return (
    <div className="flex flex-col h-screen">
      <div>
        Count: {count}
        <hr />
        <button type="button" onClick={() => void incrementCount()}>
          Increment Count
        </button>
        <button type="button" onClick={() => void decrementCount()}>
          Decrement Count
        </button>
      </div>
      <Header />
      <ChartSection />
      <TableSection />
    </div>
  );
}
