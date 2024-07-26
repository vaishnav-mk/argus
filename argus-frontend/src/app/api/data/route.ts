import { NextResponse } from "next/server";

export async function POST(request) {
  const params = request.nextUrl.searchParams;

  const reqData = await request.json();

  const page_state = reqData.page_state;
  const limit = params.get("limit") || 25;

  const response = await fetch(`http://localhost:5000/logs/data?limit=${limit}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      page_state: page_state,
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}
