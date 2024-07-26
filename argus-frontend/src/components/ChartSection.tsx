"use client";
import { ChartCard } from "@/components/ChartCard";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

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
  const {
    isError,
    errorMessage: errors,
    logs: logData,
    nextPageState: pageState,
    isLoading: loading,
  } = useSelector((state) => state.data);

  const [data, setData] = useState({});

  useEffect(() => {
    if (!logData?.length) {
      return;
    }
    let servicesData = [];
    logData.forEach((log) => {
      if (servicesData.some((service) => service.name === log.service)) {
        servicesData.find((service) => service.name === log.service).value += 1;
      } else {
        servicesData.push({
          name: log.service,
          value: 1,
          fill: `var(--color-${log.service})`,
        });
      }
    });

    setData({
      data: data.logs,
      services: servicesData,
    });
  }, [logData]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (Object.keys(data).length === 0) {
    return <div>No data available</div>;
  }

  return (
    <main className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Errors"
          description="Visualize the number of errors over time."
          data={data.data}
          type="area"
        />
        <ChartCard
          title="Error Services"
          description="Visualize the number of errors per service."
          data={data.services}
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
