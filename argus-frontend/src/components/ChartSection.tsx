"use client";
import { ChartCard } from "@/components/ChartCard";

const exampleData = {
  errors: [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 40 },
    { name: "Mar", value: 50 },
    { name: "Apr", value: 20 },
    { name: "May", value: 60 },
    { name: "Jun", value: 70 },
  ],
  latency: [
    { name: "Jan", value: 120 },
    { name: "Feb", value: 115 },
    { name: "Mar", value: 130 },
    { name: "Apr", value: 125 },
    { name: "May", value: 110 },
    { name: "Jun", value: 140 },
  ],
  throughput: [
    { name: "Jan", value: 300 },
    { name: "Feb", value: 350 },
    { name: "Mar", value: 400 },
    { name: "Apr", value: 320 },
    { name: "May", value: 450 },
    { name: "Jun", value: 500 },
  ],
};

export function ChartSection() {
  return (
    <main className="flex-1 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6">
        <ChartCard title="Errors" description="Visualize the number of errors over time." data={exampleData.errors} />
        <ChartCard title="Latency" description="Understand the latency of your application." data={exampleData.latency} />
        <ChartCard title="Throughput" description="Monitor the throughput of your application." data={exampleData.throughput} />
      </div>
    </main>
  );
}
