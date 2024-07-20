"use client";
import { ChartCard } from "@/components/ChartCard";
import { useEffect, useState, useCallback } from "react";

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
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    const url = "/api/data";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_state: "" }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log({ received: data });
        let servicesData = []
        data.logs.forEach((log) => {
          console.log({ log });
          if (servicesData.some((service) => service.name === log.service)) {
            servicesData.find((service) => service.name === log.service).value += 1;
          } else {
            servicesData.push({ name: log.service, value: 1, fill: `var(--color-${log.service})` });
          }
        })
       
        console.log({ servicesData });
        setData(servicesData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log({ data });

  return (
    <main className="flex-1 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6">
        <ChartCard
          title="Errors"
          description="Visualize the number of errors over time."
          data={exampleData.errors}
          type="area"
        />
        <ChartCard
          title="Error Services"
          description="Visualize the number of errors per service."
          data={data}
          type="pie"
        />
        <ChartCard
          title="Throughput"
          description="Monitor the throughput of your application."
          data={exampleData.throughput}
          type="area"
        />
      </div>
    </main>
  );
}
