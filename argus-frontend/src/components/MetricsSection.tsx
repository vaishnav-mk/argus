"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function MetricsSection() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Errors</CardTitle>
          <CardDescription>
            The number of error logs in the last 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">59</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Warnings</CardTitle>
          <CardDescription>
            The number of warning logs in the last 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">38</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Warnings</CardTitle>
          <CardDescription>
            The number of warning logs in the last 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">38</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Warnings</CardTitle>
          <CardDescription>
            The number of warning logs in the last 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">38</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Warnings</CardTitle>
          <CardDescription>
            The number of warning logs in the last 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">38</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Warnings</CardTitle>
          <CardDescription>
            The number of warning logs in the last 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">38</div>
        </CardContent>
      </Card>
    </div>
  );
}
