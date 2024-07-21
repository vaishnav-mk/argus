// components/PaginationComponent.tsx
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

let chartConfig = {
  value: {
    label: "value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ChartCardProps {
  title: string;
  description: string;
  data: { name: string; value: number }[];
  type: "area" | "pie" | "bar";
}

function areaChart(data: { name: string; value: number }[]) {
  let timestamps = []
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  months.forEach((month) => {
    timestamps.push({ name: month, value: Math.floor(Math.random() * 100) })
  })
  console.log({ timestamps });
  return (
    <AreaChart
      data={timestamps}
      margin={{
        left: 12,
        right: 12,
      }}
    >
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="name"
        tickarea={false}
        axisarea={false}
        tickMargin={8}
        tickFormatter={(value) => value.slice(0, 3)}
      />
      <ChartTooltip
        cursor={false}
        content={<ChartTooltipContent indicator="area" />}
      />
      <Area
        dataKey="value"
        type="natural"
        fill="var(--color-value)"
        fillOpacity={0.4}
        stroke="var(--color-value)"
      />
    </AreaChart>
  );
}

function pieChart(data: { name: string; value: number }[]) {
  if (data.length === 0) {
    return null;
  }
  const chartConfig = {
    services: {
      label: "Services",
    },
    database: {
      label: "database",
      color: "hsl(var(--chart-1))",
    },
    auth: {
      label: "Auth",
      color: "hsl(var(--chart-2))",
    },
    email: {
      label: "Email",
      color: "hsl(var(--chart-3))",
    },
    server: {
      label: "Server",
      color: "hsl(var(--chart-4))",
    },
    payment: {
      label: "Payment",
      color: "hsl(var(--chart-5))",
    },
    services: {
      label: "Services",
      color: "hsl(var(--chart-6))",
    },
  } satisfies ChartConfig;
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
          activeIndex={data?.findIndex(
            ({ value }) => value === Math.max(...data.map(({ value }) => value))
          )}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {data.reduce((acc, { value }) => acc + value, 0)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Errors
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

export function ChartCard({ title, description, data, type }: ChartCardProps) {
  console.log({ title, description, data, type });
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {type === "area" && areaChart(data)}
          {type === "pie" && pieChart(data)}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
